import React, {useCallback, useMemo, useState} from 'react';
import type {Node, NodeProps} from '@xyflow/react';
import {NodeResizer, useStore} from '@xyflow/react';

import type {EdgeType} from '../canvas';
import {Button} from "@mui/material";
import {ChevronDown, ChevronsLeftRight, ChevronsRightLeft, ChevronUp, Pencil, Table2} from "lucide-react";
import {cn} from "../../lib/utils.ts";
import {DBTable} from "../../lib/domain/db-table.ts";
import {RelationshipEdgeType} from "../edge/relationship-edge.tsx";
import {DBField} from "../../lib/domain/db-field.ts";
import {useChartDB} from "../../hooks/use-chartdb.ts";
import {useLayout} from "../../hooks/use-layout.ts";
import {useTranslation} from "react-i18next";
import {TableNodeField} from "./table-node-field.tsx";

export type TableNodeType = Node<
  {
    table: DBTable;
    isOverlapping: boolean;
    highlightOverlappingTables?: boolean;
  },
  'table'
>;

export const MAX_TABLE_SIZE = 450;
export const MID_TABLE_SIZE = 337;
export const MIN_TABLE_SIZE = 224;
export const TABLE_MINIMIZED_FIELDS = 10;

export const TableNode: React.FC<NodeProps<TableNodeType>> = React.memo(
  ({
     selected,
     dragging,
     id,
     data: {table, isOverlapping, highlightOverlappingTables},
   }) => {
    const {updateTable, relationships} = useChartDB();
    const edges = useStore((store) => store.edges) as EdgeType[];
    const {openTableFromSidebar, selectSidebarSection} = useLayout();
    const [expanded, setExpanded] = useState(false);
    const {t} = useTranslation();

    const selectedRelEdges = edges.filter(
      (edge) =>
        (edge.source === id || edge.target === id) &&
        (edge.selected || edge.data?.highlighted) &&
        edge.type === 'relationship-edge'
    ) as RelationshipEdgeType[];

    const focused = !!selected && !dragging;

    const openTableInEditor = () => {
      selectSidebarSection('tables');
      openTableFromSidebar(table.id);
    };

    const expandTable = useCallback(() => {
      updateTable(table.id, {
        width:
          (table.width ?? MIN_TABLE_SIZE) < MID_TABLE_SIZE
            ? MID_TABLE_SIZE
            : MAX_TABLE_SIZE,
      });
    }, [table.id, table.width, updateTable]);

    const shrinkTable = useCallback(() => {
      updateTable(table.id, {
        width: MIN_TABLE_SIZE,
      });
    }, [table.id, updateTable]);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const isMustDisplayedField = useCallback(
      (field: DBField) => {
        return (
          relationships.some(
            (relationship) =>
              relationship.sourceFieldId === field.id ||
              relationship.targetFieldId === field.id
          ) || field.primaryKey
        );
      },
      [relationships]
    );

    const visibleFields = useMemo(() => {
      if (expanded) {
        return table.fields;
      }

      const mustDisplayedFields = table.fields.filter((field: DBField) =>
        isMustDisplayedField(field)
      );
      const nonMustDisplayedFields = table.fields.filter(
        (field: DBField) => !isMustDisplayedField(field)
      );

      const visibleMustDisplayedFields = mustDisplayedFields.slice(
        0,
        TABLE_MINIMIZED_FIELDS
      );
      const remainingSlots =
        TABLE_MINIMIZED_FIELDS - visibleMustDisplayedFields.length;
      const visibleNonMustDisplayedFields = nonMustDisplayedFields.slice(
        0,
        remainingSlots
      );

      return [
        ...visibleMustDisplayedFields,
        ...visibleNonMustDisplayedFields,
      ].sort((a, b) => table.fields.indexOf(a) - table.fields.indexOf(b));
    }, [expanded, table.fields, isMustDisplayedField]);

    return (
      <div
        className={cn(
          'flex w-full flex-col border-2 bg-slate-50 dark:bg-slate-950 rounded-lg shadow-sm transition-transform duration-300',
          selected
            ? 'border-pink-600'
            : 'border-slate-500 dark:border-slate-700',
          isOverlapping
            ? 'ring-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-blue-500 ring-offset-2'
            : '',
          !highlightOverlappingTables && isOverlapping
            ? 'animate-scale'
            : '',
          highlightOverlappingTables && isOverlapping
            ? 'animate-scale-2'
            : ''
        )}
        onClick={(e) => {
          if (e.detail === 2) {
            openTableInEditor();
          }
        }}
      >
        <NodeResizer
          isVisible={focused}
          lineClassName="!border-none !w-2"
          minWidth={MIN_TABLE_SIZE}
          maxWidth={MAX_TABLE_SIZE}
          shouldResize={(event) => event.dy === 0}
          handleClassName="!hidden"
        />
        {/*<TableNodeDependencyIndicator
                        table={table}
                        focused={focused}
                    />*/}
        <div
          className="h-2 rounded-t-[6px]"
          style={{backgroundColor: table.color}}
        ></div>
        <div className="group flex h-9 items-center justify-between bg-slate-200 px-2 dark:bg-slate-900">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Table2 className="size-3.5 shrink-0 text-gray-600 dark:text-primary"/>
            <p className="truncate text-sm font-bold">
              {table.name}
            </p>
          </div>
          <div className="hidden shrink-0 flex-row group-hover:flex">
            <Button
              className="min-w-8 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              onClick={openTableInEditor}
            >
              <Pencil className="size-4"/>
            </Button>
            <Button
              className="min-w-8 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              onClick={
                table.width !== MAX_TABLE_SIZE
                  ? expandTable
                  : shrinkTable
              }
            >
              {table.width !== MAX_TABLE_SIZE ? (
                <ChevronsLeftRight className="size-4"/>
              ) : (
                <ChevronsRightLeft className="size-4"/>
              )}
            </Button>
          </div>
        </div>
        <div
          className="transition-[max-height] duration-200 ease-in-out"
          style={{
            maxHeight: expanded
              ? `${table.fields.length * 2}rem` // h-8 per field
              : `${TABLE_MINIMIZED_FIELDS * 2}rem`, // h-8 per field
          }}
        >
          {table.fields.map((field: DBField) => (
            <TableNodeField
              key={field.id}
              focused={focused}
              tableNodeId={id}
              field={field}
              highlighted={selectedRelEdges.some(
                (edge) =>
                  edge.data?.relationship
                    .sourceFieldId === field.id ||
                  edge.data?.relationship
                    .targetFieldId === field.id
              )}
              visible={visibleFields.includes(field)}
              isConnectable={!table.isView}
            />
          ))}
        </div>
        {table.fields.length > TABLE_MINIMIZED_FIELDS && (
          <div
            className="z-10 flex h-8 cursor-pointer items-center justify-center rounded-b-md border-t text-xs text-muted-foreground transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={toggleExpand}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 size-3.5"/>
                {t('show_less')}
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 size-3.5"/>
                {t('show_more')}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

TableNode.displayName = 'TableNode';
