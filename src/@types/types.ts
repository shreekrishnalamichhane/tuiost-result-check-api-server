export type T_ResultOption = {
    "id": string | undefined,
    "name": string | undefined
}

export type T_CacheResultOptionData = {
    expiredAt: number,
    data: T_ResultOption[]
}