export enum RoleEnum {
    ROOT = 1,
    ADMIN = 2,
    CLIENT = 3,
}

// Mapeamento de string role para número
export const RoleStringToEnum: Record<string, number> = {
    'root': RoleEnum.ROOT,
    'admin': RoleEnum.ADMIN,
    'client': RoleEnum.CLIENT,
};

// Função helper para converter string role para enum
export function getRoleArtFromString(role: string): number {
    if (!role) return RoleEnum.CLIENT;
    const roleLower = role.toLowerCase();
    return RoleStringToEnum[roleLower] || RoleEnum.CLIENT;
}