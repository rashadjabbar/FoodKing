export class Category {
    id!: number
    name?: string
    status?: true
}

export class ComboBox {
    key?: number
    value?: string
}

export class SubCategory {
    id!: number
    subCategoryName?: string
    categoryName?: string
    hexColor?: string
    status?: true
}


export class AllCategoryBrowse {
    id?: number
    name?: string
    subCategoryData?: ComboBox[]
}

