import { ReactNode } from 'react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface ColorScheme {
  primary: string;
  background: string;
  text: string;
  textLight: string;
  border: string;
}
