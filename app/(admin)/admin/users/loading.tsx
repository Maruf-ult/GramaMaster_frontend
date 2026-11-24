import { TableSkeleton } from "@/components/ui/skeleton-card";

export default function UsersLoading() {
    return <TableSkeleton rows={10} />;
}