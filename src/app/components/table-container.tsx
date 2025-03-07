'use client'
import { flexRender, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable, type ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import TableDisplay from './table';
import { Input } from '~/components/ui/input';
import { ChevronDown, Hash, Plus, Type } from 'lucide-react';
import debounce from 'lodash.debounce';
import { api } from '~/trpc/react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { FieldPopover } from './add-field-popover';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '~/components/ui/button';

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

export type Data = Record<string, { id: number, value: string | number | null, rowId: number, columnId: number }>;

export default function TableContainer({ tableId, shouldRefetch }: { tableId: string, shouldRefetch?: boolean }) {
	// const [data, setData] = useState<Data[]>([]);
	const [columns, setColumns] = useState<ColumnDef<Data>[]>([]);
	const [sorting, setSorting] = React.useState<SortingState>([])

	const { data: originData, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
		api.table.getPaginatedRows.useInfiniteQuery(
			{
				tableId,
				limit: 50,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
			}
		);


	const [tableData, setTableData] = useState<Data[]>([]);

	useEffect(() => {
		if (originData) {
			const flattenedData = originData.pages.flatMap((page) => page.rows) || [];
			setTableData(flattenedData);
		}
	}, [originData]);


	useEffect(() => {
		// if (shouldRefetch) {
		void refetch();
		setTableData([]);
		setColumns([]);
		// set
		// }
	}, [shouldRefetch]);


	// const allRows = originData?.pages.flatMap(page => page.rows) ?? [];
	console.log('TableData', tableData);
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
		onSortingChange: setSorting,
	});

	const { rows: rowsData } = table.getRowModel()

	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: tableData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
		overscan: 30,
	});

	React.useEffect(() => {
		const virtualItems = rowVirtualizer.getVirtualItems();
		if (virtualItems.length === 0) return;

		const lastItem = virtualItems[virtualItems.length - 1]; // Get the last rendered item
		if (!lastItem) return;

		// Ensure fetching only triggers when the last item is actually in view
		const isNearBottom =
			lastItem.index >= tableData.length - 1 - 5; // Adjust threshold (5 means load when 5 items remain)

		if (isNearBottom && hasNextPage && !isFetchingNextPage) {
			console.log('Fetching Next Page...');
			// void fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		tableData.length,
		isFetchingNextPage,
		rowVirtualizer.getVirtualItems(),
	]);


	const handleCellChange = (cellId: number, columnId: number, value: string | number) => {

		setTableData((prevData) => {
			const newData = [...prevData];

			// Find the row that contains the cell
			const rowIndex = newData.findIndex((row) => row[columnId]?.id === cellId);
			if (rowIndex === -1) return prevData;

			// Update only the specific cell instead of recreating the entire row object
			newData[rowIndex] = {
				...newData[rowIndex],
				[columnId]: { ...newData[rowIndex]?.[columnId], value },
			};

			return newData;
		});

		void debouncedUpdateCell(cellId, value);
	};

	const debouncedUpdateCell = React.useCallback(
		debounce(async (cellId: number, value: string | number) => {
			try {
				await axios.put('/api/cells', { cellId, value });
			} catch (error) {
				console.error('Failed to update cell', error);
			}
		}, 150),
		[]
	);


	const addColumn = async (fieldName: string, fieldType: string) => {
		try {
			const response = await axios.post<{ column: Column, cells: Cell[] }>('/api/columns', { tableId, name: fieldName, type: fieldType });
			const payload = response.data;

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

			console.log('newCells', newCells);

			setTableData(prev => {
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

			setTableData(prev => [...prev, newRow]);

		} catch (error) {
			console.error('Failed to add row', error);
		}
	};

	const fetchTableColumns = async () => {
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

			console.log('RowData', table.columns);
			setColumns(columnDefs);

			// const rowData: Data[] = table.rows.map((row) => {
			// 	const rowData: Data = {};
			// 	row.cells.forEach((cell) => {
			// 		rowData[cell.columnId] = { id: cell.id, value: cell.value, rowId: row.id, columnId: cell.columnId };
			// 	});
			// 	return rowData;
			// });
			// console.log('ColumnDefs', columnDefs);
			// setData(rowData);




		} catch (error) {
			console.error('Failed to fetch table', error)
		}
	}

	useEffect(() => {
		void fetchTableColumns()
	}, [tableId])



	const cellWidth = 200; // Fixed width for each cell
	const tableWidth = (columns.length + 1) * cellWidth; // Scale table width based on columns count

	const divRef = useRef<HTMLDivElement>(null);
	const [rows, setRows] = useState(0);

	// useEffect(() => {
	// 	if (divRef.current) {
	// 		const tableHeight = data.length * 30 + 30;
	// 		const remainingHeight = divRef.current.clientHeight - tableHeight;
	// 		console.log('Remaining Height', remainingHeight);
	// 		console.log('Table Height', tableHeight);
	// 		if (remainingHeight < 0) {
	// 			setRows(4);
	// 			return;
	// 		}
	// 		const rows = Math.floor(remainingHeight / 30);
	// 		setRows(rows - 1);
	// 	}
	// }, [data, columns]);

	if (columns.length === 0) {
		return null;

	}
	return (

		<div ref={parentRef} className="overflow-x-auto bg-[#F7F7F7] flex flex-grow " style={{
			height: `${rowVirtualizer.getTotalSize()}px`, width: '100%',
			position: 'relative',
		}}>
			<Table className="border-collapse border border-gray-300 border-r-0 border-b-0 text-xs" style={{ width: tableWidth }}>
				<TableHeader className="sticky top-0 bg-white">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="hover:bg-transparent bg-gray-100 bg-red">
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id} style={{ width: cellWidth }} className="h-8 border border-gray-300 ">
									<div className="flex flex-row justify-between items-center">
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										<ChevronDown className="w-3" />
									</div>
								</TableHead>
							))}
							<TableHead style={{ width: cellWidth }} className="h-8 border border-gray-300">
								<FieldPopover onCreateField={addColumn}>
									<button className="flex items-center justify-center w-full h-full">
										<Plus className="w-4 h-4 text-gray-400" />
									</button>
								</FieldPopover>
							</TableHead>
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{/* {table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} className="hover:bg-gray-100 border-none">
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} style={{ width: cellWidth }} className="h-[30px] p-0 border border-gray-300 bg-white ">
									<div className="h-full flex items-center w-full">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								</TableCell>
							))}
						</TableRow>
					))} */}
					{/* {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
						const row = table.getRowModel().rows[virtualRow.index];
						return (
							<TableRow key={row?.id} className="hover:bg-gray-100 border-none">
								{row?.getVisibleCells().map((cell) => (
									// <TableCell key={cell.id} className="border border-gray-300">
									// 	{flexRender(cell.column.columnDef.cell, cell.getContext())}
									// </TableCell>
									<TableCell key={cell.id} style={{ width: cellWidth }} className="h-[30px] p-0 border border-gray-300 bg-white ">
										<div className="h-full flex items-center w-full">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
											<b>{index}</b>
										</div>
									</TableCell>
								))}
							</TableRow>
						);
					})} */}
					{rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
						const row = rowsData[virtualRow.index]
						return (
							<TableRow key={row?.id} className="hover:bg-gray-100 border-none">
								{row?.getVisibleCells().map((cell, id) => (
									<TableCell key={cell.id} style={{ width: cellWidth }} className="h-[30px] p-0 border border-gray-300 bg-white ">
										<div className="h-full flex items-center w-full">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</div>
									</TableCell>
								))}
							</TableRow>
						);
					})}



					<TableRow className="hover:bg-gray-100 border-none">
						<TableCell colSpan={1} className="h-[30px] p-0 border border-gray-300 bg-white">
							<div className="h-full px-4 flex items-center cursor-pointer" onClick={addRow}>
								<Plus className="w-4 h-4 text-gray-400" />
							</div>
						</TableCell>
						<TableCell colSpan={columns.length - 1} className="h-[30px] p-0 border border-gray-300 bg-white">
						</TableCell>
					</TableRow>


					<TableRow className="hover:bg-gray-100 border-none">
						<TableCell colSpan={1} rowSpan={rows} className="h-[30px] p-0 border border-gray-300 bg-white">
						</TableCell>
						<TableCell colSpan={columns.length - 1} className="h-[30px] ">
						</TableCell>
					</TableRow>
					{Array.from({ length: rows - 1 }, (_, i) => (
						<TableRow key={i} className="hover:bg-gray-100 border-none">
							<TableCell colSpan={columns.length - 1} className="h-[30px]  ">
							</TableCell>
						</TableRow>
					))}

				</TableBody>
				<TableFooter className="border-none sticky bottom-0 bg-white">
					<TableRow className="hover:bg-gray-100 border-none">
						<TableCell colSpan={1} className="h-[30px] p-0 border border-gray-300 bg-white">
							<div className="h-full px-4 flex items-center">
								Footer
							</div>
						</TableCell>
						<TableCell colSpan={columns.length - 1} className="h-[30px] p-0 border border-gray-300 bg-white">
						</TableCell>
					</TableRow>
					{hasNextPage && <Button onClick={() => fetchNextPage()} className="mt-2">Load More</Button>}

				</TableFooter>
			</Table>

		</div>
		// </div>

	)
}
