// Dynamic Tier Boundaries Configuration (in INR)
export const TIERS = [
    { name: 'Bronze', minSpend: 0, maxSpend: 5000 },
    { name: 'Silver', minSpend: 5000, maxSpend: 10000 },
    { name: 'Gold', minSpend: 10000, maxSpend: 25000 },
    { name: 'VIP', minSpend: 25000, maxSpend: 50000 },
    { name: 'Platinum', minSpend: 50000, maxSpend: Infinity }
];

export const calculateValueTier = (totalSpend) => {
    for (const tier of TIERS) {
        if (totalSpend >= tier.minSpend && totalSpend < tier.maxSpend) {
            return tier.name;
        }
    }
    return 'Platinum';
};
