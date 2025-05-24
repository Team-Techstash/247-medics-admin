import { ReactNode } from 'react';

export interface FlushDatatype {
    id: string;
    head: string;
    text: ReactNode;
}

export interface IconDataType {
    id: string;
    icon: string;
    head: string;
    text: ReactNode;
}

export interface OutlineDataType {
    id: string;
    head: string;
    text: string;
} 