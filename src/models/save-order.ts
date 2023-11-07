export class SaveOrder {
    id?: number = 0
    serviceFee?: number
    amount?: number
    orderItems?: OrderItem[]
    deletedItems?: number[]
}

export class OrderItem {
    productId?: number
    productName?: number
    count?: number
    price?: number
}

export class BrowseOrder {
    id!: number
    categoryName?: string
    subCategoryName?: string
    productName?: string
    count?: number
    amount?: number
    createdDate?: string
    status?: true
}
