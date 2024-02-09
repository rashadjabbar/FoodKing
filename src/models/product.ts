export class Product {
    id!: number
    subCategoryId!: number
    name?: string
    price?: number
    status?: true
}

export class ProductBrowseData {
    id!: number
    productName?: string
    categoryName?:  string
    imagePath?: string
    price?: number
    subCategoryName?:  string
    averageRating?: number
    isFavorite?: boolean = false
    oldPrice?: number
}