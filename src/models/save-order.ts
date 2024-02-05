export class SaveOrder {
    id?: number = 0
    serviceFee?: number
    amount?: number
    note?: string
    orderItems?: OrderItem[]
    deletedItems?: number[]
}

export class OrderItem {
    productId?: number
    productName?: string
    count?: number
    price?: number
    amount?: number
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

export class ServiceFeeByUserAndAmount
{
    userId?: number
    amount?: number
}
