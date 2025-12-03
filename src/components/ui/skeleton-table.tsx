import { TableRow, TableCell } from './table'

export function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="h-4 w-24 bg-slate-200 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-slate-200 rounded-md" />
        <div className="h-3 w-48 mt-2 bg-slate-100 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-slate-200 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-slate-200 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-32 bg-slate-200 rounded-md" />
      </TableCell>
    </TableRow>
  )
}

export function SkeletonTable() {
  return (
    <>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </>
  )
}
