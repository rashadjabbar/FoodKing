export class ClientOrder {
    id?: number
    no?: string
    itemCount?: number
    serviceFee?: number
    amount?: number
    createdDate?: string
    orderStatus?: number
    status?: string
    items!: OrderItem[]
}

export class OrderItem {
    id!: number
    orderId?: number
    name?: string
    count?: number
    price?: number
}
