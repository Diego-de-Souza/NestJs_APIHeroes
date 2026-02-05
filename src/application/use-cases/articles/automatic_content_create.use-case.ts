import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class AutomaticContentCreateUseCase {
    private readonly logger = new Logger(AutomaticContentCreateUseCase.name);

    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly httpService: HttpService
    ) {} 

    @Cron('0 6 */3 * *')  // A cada 3 dias às 6h da manhã
    async syncArticles() {
        this.logger.log('🚀 Iniciando sincronização automática de artigos...');
        
        const categorias = ['animes', 'manga', 'filmes', 'studios', 'games', 'tech'];
        let totalNovosArtigos = 0;
        let idsParaManter: string[] = [];
        
        try {
            // 🔍 ETAPA 1: COLETA TODOS OS ARTIGOS DE TODAS AS CATEGORIAS
            this.logger.log('📡 Coletando artigos de todas as categorias...');
            
            let todosArtigosRecebidos = [];
            
            for (const categoria of categorias) {
                this.logger.log(`📖 Processando categoria: ${categoria}`);
                
                try {
                    const response = await firstValueFrom(
                        this.httpService.post('http://content-processor:8000/api/v1/batch/articles', {
                            category: categoria,    // animes, manga, filmes, studios, games, tech
                            limit: 4,              // quantos artigos
                            min_score: 0.7         // qualidade mínima
                        }, {
                            timeout: 30000,        // 30 segundos timeout
                            headers: { 'Content-Type': 'application/json' }
                        })
                    );
                    
                    if (!response.data?.articles || !Array.isArray(response.data.articles)) {
                        this.logger.warn(`⚠️ Nenhum artigo retornado para categoria: ${categoria}`);
                        continue;
                    }
                    
                    const { articles, total_processed, processing_time } = response.data;
                    this.logger.log(`📝 Categoria ${categoria}: ${articles.length} artigos (processados: ${total_processed}, tempo: ${processing_time}ms)`);
                    
                    // Adiciona os artigos à lista geral
                    todosArtigosRecebidos = [...todosArtigosRecebidos, ...articles];
                    
                } catch (categoryError) {
                    this.logger.error(`❌ Erro ao processar categoria ${categoria}:`, categoryError.message);
                }
                
                // Delay entre categorias para não sobrecarregar a API
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            this.logger.log(`📊 Total de artigos coletados: ${todosArtigosRecebidos.length}`);
            
            if (todosArtigosRecebidos.length === 0) {
                this.logger.warn('⚠️ Nenhum artigo foi coletado. Encerrando sincronização.');
                return;
            }
            
            // 🔍 ETAPA 2: VERIFICA ARTIGOS EXISTENTES POR TÍTULO
            this.logger.log('🔍 Verificando artigos existentes no banco...');
            
            const artigosParaSalvar = [];
            
            for (const articleReceived of todosArtigosRecebidos) {
                try {
                    // Busca artigo existente por título
                    const existingArticle = await this.articlesRepository.findByTitle(articleReceived.title);
                    
                    if (existingArticle) {
                        // Se existe, guarda o ID para manter no banco
                        idsParaManter.push(existingArticle.id);
                        this.logger.log(`🔄 Artigo existente mantido: "${articleReceived.title}" (ID: ${existingArticle.id})`);
                    } else {
                        // Se não existe, adiciona à lista para salvar
                        artigosParaSalvar.push(articleReceived);
                        this.logger.log(`✨ Novo artigo para salvar: "${articleReceived.title}"`);
                    }
                    
                } catch (searchError) {
                    this.logger.error(`❌ Erro ao buscar artigo "${articleReceived.title}":`, searchError.message);
                    // Em caso de erro, assume que é novo e adiciona para salvar
                    artigosParaSalvar.push(articleReceived);
                }
            }
            
            this.logger.log(`📊 Resumo: ${idsParaManter.length} artigos mantidos, ${artigosParaSalvar.length} novos artigos`);
            
            // 🗑️ ETAPA 3: REMOVE ARTIGOS ANTIGOS (EXCETO OS IDS PARA MANTER)
            if (idsParaManter.length > 0) {
                this.logger.log('🗑️ Removendo artigos antigos...');
                
                try {
                    const deletedCount = await this.articlesRepository.deleteAllExceptIds(idsParaManter);
                    this.logger.log(`🗑️ ${deletedCount} artigos antigos removidos`);
                } catch (deleteError) {
                    this.logger.error('❌ Erro ao remover artigos antigos:', deleteError.message);
                    throw deleteError;
                }
            } else {
                // Se não há IDs para manter, limpa toda a tabela
                this.logger.log('🗑️ Limpando toda a tabela de artigos...');
                try {
                    const deletedCount = await this.articlesRepository.deleteAll();
                    this.logger.log(`🗑️ ${deletedCount} artigos removidos da tabela`);
                } catch (deleteError) {
                    this.logger.error('❌ Erro ao limpar tabela:', deleteError.message);
                    throw deleteError;
                }
            }
            
            // 💾 ETAPA 4: SALVA OS NOVOS ARTIGOS
            this.logger.log('💾 Salvando novos artigos...');
            
            for (const article of artigosParaSalvar) {
                try {
                    const savedArticle = await this.articlesRepository.createArticle({
                        category: article.category,         // ✅ Campo do seu banco
                        title: article.title,              // ✅ Título do artigo
                        description: article.description,   // ✅ Pequena descrição
                        text: article.text,                // ✅ Artigo completo reescrito pela IA
                        summary: article.summary,          // ✅ Resumo do artigo
                        keyWords: article.keyWords,        // ✅ Palavras-chave
                        route: article.original_url, // ✅ URL original
                        author: article.source,            // ✅ Fonte do artigo
                    });
                    
                    totalNovosArtigos++;
                    this.logger.log(`✅ Novo artigo salvo: "${article.title}" (ID: ${savedArticle.id})`);
                    
                } catch (saveError) {
                    this.logger.error(`❌ Erro ao salvar artigo "${article.title}":`, saveError.message);
                }
            }
            
            // 📊 RESUMO FINAL
            this.logger.log(`🎉 Sincronização concluída!`);
            this.logger.log(`📊 Resumo:`);
            this.logger.log(`   • Artigos existentes mantidos: ${idsParaManter.length}`);
            this.logger.log(`   • Novos artigos salvos: ${totalNovosArtigos}`);
            this.logger.log(`   • Total final no banco: ${idsParaManter.length + totalNovosArtigos}`);
            
        } catch (error) {
            this.logger.error('💥 Erro geral na sincronização de artigos:', error.message);
            throw error;
        }
    }
}