export class Category {
    id!: number
    name?: string
    status?: true
}

export class AllCategory {
    key?: number
    value?: string
}

export class SubCategory {
    id!: number
    subCategoryName?: string
    categoryName?: string
    status?: true
}


export class AllCategoryBrowse {
    id?: number
    name?: string
    subCategoryData?: AllCategory[]
}

