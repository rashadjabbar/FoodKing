export class LuckyWheelPrize {
  id!: number;
  name!: string;
  color?: string;
  weight?: number; // relative probability weight for this prize
}

export class SaveUserPrizeRequest {
  prizeId!: number;
}

export class LuckyWheelEligibility {
  isActive!: boolean;
  message?: string;
}
