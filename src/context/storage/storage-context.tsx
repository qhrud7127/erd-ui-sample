import { createContext } from 'react';
import {ChartDBConfig} from "../../lib/domain/config.ts";
import {Diagram} from "../../lib/domain/diagram.ts";
import {DBTable} from "../../lib/domain/db-table.ts";
import {DBRelationship} from "../../lib/domain/db-relationship.ts";
import {DBDependency} from "../../lib/domain/db-dependency.ts";
import {emptyFn} from "../../lib/utils.ts";

export interface StorageContext {
    // Config operations
    getConfig: () => Promise<ChartDBConfig | undefined>;
    updateConfig: (config: Partial<ChartDBConfig>) => Promise<void>;

    // Diagram operations
    addDiagram: (params: { diagram: Diagram }) => Promise<void>;
    listDiagrams: (options?: {
        includeTables?: boolean;
        includeRelationships?: boolean;
        includeDependencies?: boolean;
    }) => Promise<Diagram[]>;
    getDiagram: (
        id: string,
        options?: {
            includeTables?: boolean;
            includeRelationships?: boolean;
            includeDependencies?: boolean;
        }
    ) => Promise<Diagram | undefined>;
    updateDiagram: (params: {
        id: string;
        attributes: Partial<Diagram>;
    }) => Promise<void>;
    deleteDiagram: (id: string) => Promise<void>;

    // Table operations
    addTable: (params: { diagramId: string; table: DBTable }) => Promise<void>;
    getTable: (params: {
        diagramId: string;
        id: string;
    }) => Promise<DBTable | undefined>;
    updateTable: (params: {
        id: string;
        attributes: Partial<DBTable>;
    }) => Promise<void>;
    putTable: (params: { diagramId: string; table: DBTable }) => Promise<void>;
    deleteTable: (params: { diagramId: string; id: string }) => Promise<void>;
    listTables: (diagramId: string) => Promise<DBTable[]>;
    deleteDiagramTables: (diagramId: string) => Promise<void>;

    // Relationships operations
    addRelationship: (params: {
        diagramId: string;
        relationship: DBRelationship;
    }) => Promise<void>;
    getRelationship: (params: {
        diagramId: string;
        id: string;
    }) => Promise<DBRelationship | undefined>;
    updateRelationship: (params: {
        id: string;
        attributes: Partial<DBRelationship>;
    }) => Promise<void>;
    deleteRelationship: (params: {
        diagramId: string;
        id: string;
    }) => Promise<void>;
    listRelationships: (diagramId: string) => Promise<DBRelationship[]>;
    deleteDiagramRelationships: (diagramId: string) => Promise<void>;

    // Dependencies operations
    addDependency: (params: {
        diagramId: string;
        dependency: DBDependency;
    }) => Promise<void>;
    getDependency: (params: {
        diagramId: string;
        id: string;
    }) => Promise<DBDependency | undefined>;
    updateDependency: (params: {
        id: string;
        attributes: Partial<DBDependency>;
    }) => Promise<void>;
    deleteDependency: (params: {
        diagramId: string;
        id: string;
    }) => Promise<void>;
    listDependencies: (diagramId: string) => Promise<DBDependency[]>;
    deleteDiagramDependencies: (diagramId: string) => Promise<void>;
}

export const storageContext = createContext<StorageContext>({
    getConfig: emptyFn,
    updateConfig: emptyFn,

    addDiagram: emptyFn,
    listDiagrams: emptyFn,
    getDiagram: emptyFn,
    updateDiagram: emptyFn,
    deleteDiagram: emptyFn,

    addTable: emptyFn,
    getTable: emptyFn,
    updateTable: emptyFn,
    putTable: emptyFn,
    deleteTable: emptyFn,
    listTables: emptyFn,
    deleteDiagramTables: emptyFn,

    addRelationship: emptyFn,
    getRelationship: emptyFn,
    updateRelationship: emptyFn,
    deleteRelationship: emptyFn,
    listRelationships: emptyFn,
    deleteDiagramRelationships: emptyFn,

    addDependency: emptyFn,
    getDependency: emptyFn,
    updateDependency: emptyFn,
    deleteDependency: emptyFn,
    listDependencies: emptyFn,
    deleteDiagramDependencies: emptyFn,
});
