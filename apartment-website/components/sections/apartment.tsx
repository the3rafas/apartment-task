'use client';

export interface Apartment {
  id: string;
  name: string;
  unitNumber: number;
  projectName: string;
  description: string;
}

interface ApartmentSectionProps {
  apartments: Apartment[];
}

function ApartmentSection({ apartments }: ApartmentSectionProps) {
  return <></>;
}

export default ApartmentSection;
