'use client'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TableDisplay from './table';
import { Input } from '~/components/ui/input';
import { Hash, Type } from 'lucide-react';
import debounce from 'lodash.debounce';

interface Cell {
	id: number;
	rowId: number;
	columnId: number;
	value: string;
	createdAt: string;
}

interface Row {
	id: number;
	tableId: string;
	createdAt: string;
	cells: Cell[];
}

interface Column {
	id: number;
	name: string;
	type: string;
	tableId: string;
	createdAt: string;
}

interface Table {
	id: string;
	name: string;
	baseId: string;
	createdAt: string;
	columns: Column[];
	rows: Row[];
}

export type Data = Record<string, { id: number, value: string | number, rowId: number, columnId: number }>;

export default function TableContainer({ tableId }: { tableId: string }) {
	const [data, setData] = useState<Data[]>([]);
	const [columns, setColumns] = useState<ColumnDef<Data>[]>([]);

	const handleCellChange = (cellId: number, columnId: number, value: string | number) => {
		setData((prevData) => {
			const newData = prevData.map((row) => {
				if (row[columnId]?.id === cellId) {
					return { ...row, [columnId]: { id: cellId, value: value } };
				}
				return row;
			});
			return newData;
		});

		void debouncedUpdateCell(cellId, value);
	};

	const debouncedUpdateCell = debounce(async (cellId: number, value: string | number) => {
		try {
			await axios.put('/api/cells', { cellId, value });
		} catch (error) {
			console.error('Failed to update cell', error);
		}
	}, 300);

	const addColumn = async (fieldName: string, fieldType: string) => {
		try {
			const response = await axios.post<{ column: Column, cells: Cell[] }>('/api/columns', { tableId, name: fieldName, type: fieldType });
			const payload = response.data;
			console.log('Payload', payload);

			const newColumn = payload.column;
			const newCells = payload.cells;

			const newColumnDef: ColumnDef<Data> = {
				accessorKey: newColumn.id.toString(),
				header: () => (
					<div className="flex items-center gap-2">
						{newColumn.type === 'number' ? <Hash className="w-3" /> : <Type className="w-3" />} {newColumn.name}
					</div>
				),
				cell: ({ getValue, column: col }) => {
					const cellData = getValue() as { id: number, value: string | number };
					return (
						<Input
							type='text'
							className="w-full h-full focus:border-[#176EE1] pl-3 rounded-none border-none focus:border-solid focus:border-[2px]"
							value={cellData.value as string}
							data-cell-id={cellData.id}
							onChange={(e) => handleCellChange(cellData.id, newColumn.id, e.target.value)}
						/>
					);
				}
			};

			setColumns(prev => [...prev, newColumnDef]);

			setData(prev => {
				const newData = prev.map(row => {
					const rowId = Object.keys(row)[0]; // Dynamically get the first key
					// @ts-ignore
					const cell = newCells.find(cell => cell.rowId === row[rowId]?.rowId);
					return { ...row, [newColumn.id]: { id: cell?.id, value: cell?.value, rowId: cell?.rowId, columnId: cell?.columnId } };
				});
				return newData;
			});

		} catch (error) {
			console.error('Failed to add column', error);
		}
	};

	const addRow = async () => {
		try {
			const response = await axios.post<{ row: Row, cells: Cell[] }>('/api/rows', { tableId });
			const { row, cells } = response.data;

			const newRow: Data = {};
			cells.forEach((cell) => {
				newRow[cell.columnId] = { id: cell.id, value: cell.value, rowId: row.id, columnId: cell.columnId };
			});

			setData(prev => [...prev, newRow]);

		} catch (error) {
			console.error('Failed to add row', error);
		}
	};

	const fetchTable = async () => {
		try {
			const response = await axios.get<Table>(`/api/tables`, {
				params: {
					tableId: tableId
				}
			});

			const table = response.data;

			const columnDefs: ColumnDef<Data>[] = table.columns.map((column) => ({
				accessorKey: column.id.toString(),
				header: () => (
					<div className="flex items-center gap-2">
						{column.type === 'number' ? <Hash className="w-3" /> : <Type className="w-3" />} {column.name}
					</div>
				),
				cell: ({ getValue, column: col }) => {
					const cellData = getValue() as { id: number, value: string | number };
					return (
						<Input
							type='text'
							className="w-full h-full focus:border-[#176EE1] pl-3 rounded-none border-none focus:border-solid focus:border-[2px]"
							value={cellData.value as string}
							data-cell-id={cellData.id}
							onChange={(e) => handleCellChange(cellData.id, column.id, e.target.value)}
						/>
					);
				}
			}));

			const rowData: Data[] = table.rows.map((row) => {
				const rowData: Data = {};
				row.cells.forEach((cell) => {
					rowData[cell.columnId] = { id: cell.id, value: cell.value, rowId: row.id, columnId: cell.columnId };
				});
				return rowData;
			});

			console.log('RowData', rowData);
			console.log('ColumnDefs', columnDefs);

			setColumns(columnDefs);
			setData(rowData);

		} catch (error) {
			console.error('Failed to fetch table', error)
		}
	}

	useEffect(() => {
		void fetchTable()
	}, [tableId])

	if (data.length === 0 || columns.length === 0) {
		return null;
	}

	return (
		<TableDisplay initialColumns={columns} initialData={data} addColumn={addColumn} addRow={addRow} />
	)
}
