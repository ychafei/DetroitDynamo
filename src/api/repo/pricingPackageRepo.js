import { base44 } from '@/api/base44Client';

export const pricingPackageRepo = {
  list: (sort) => base44.entities.PricingPackage.list(sort),
  filter: (where, sort) => base44.entities.PricingPackage.filter(where, sort),
  create: (data) => base44.entities.PricingPackage.create(data),
  update: (id, data) => base44.entities.PricingPackage.update(id, data),
  delete: (id) => base44.entities.PricingPackage.delete(id),
};
