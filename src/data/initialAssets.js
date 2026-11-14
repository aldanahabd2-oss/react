/** In-memory seed data for company computer assets (Part 1 — no database). */
export const initialAssets = [
  {
    id: 1,
    tag: 'PC-001',
    name: 'Dell OptiPlex 7090',
    type: 'Desktop',
    assignedTo: 'Sara Al-Hassan',
    department: 'Finance',
    status: 'In Use',
    purchaseDate: '2024-03-12',
  },
  {
    id: 2,
    tag: 'LP-014',
    name: 'Lenovo ThinkPad X1 Carbon',
    type: 'Laptop',
    assignedTo: 'Omar Saleh',
    department: 'Engineering',
    status: 'In Use',
    purchaseDate: '2025-01-20',
  },
  {
    id: 3,
    tag: 'MN-008',
    name: 'LG UltraFine 27"',
    type: 'Monitor',
    assignedTo: 'Unassigned',
    department: 'IT',
    status: 'Available',
    purchaseDate: '2023-11-05',
  },
  {
    id: 4,
    tag: 'SV-002',
    name: 'HP ProLiant DL380',
    type: 'Server',
    assignedTo: 'IT Infrastructure',
    department: 'IT',
    status: 'In Use',
    purchaseDate: '2022-08-18',
  },
]

export const ASSET_TYPES = ['Desktop', 'Laptop', 'Monitor', 'Server', 'Peripheral']
export const ASSET_STATUSES = ['Available', 'In Use', 'Under Repair', 'Retired']
