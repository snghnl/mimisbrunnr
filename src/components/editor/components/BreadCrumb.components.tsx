import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Fragment } from "react";

const COLLAPSE_THRESHOLD = 4;

interface BreadCrumbProps {
  path: string;
  className?: string;
}

export default function BreadCrumb({ path, className }: BreadCrumbProps) {
  const segments = path.split("/").filter(Boolean);
  const dirs = segments.slice(0, -1);
  const filename = segments[segments.length - 1];

  const isCollapsed = dirs.length > COLLAPSE_THRESHOLD;
  const visibleFirst = isCollapsed ? dirs.slice(0, 1) : dirs;
  const hiddenMiddle = isCollapsed ? dirs.slice(1, dirs.length - 1) : [];
  const visibleLast = isCollapsed ? dirs.slice(dirs.length - 1) : [];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-[10.5px]">
        {visibleFirst.map((dir) => (
          <Fragment key={dir}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{dir}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </Fragment>
        ))}

        {isCollapsed && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex items-center gap-1">
                    ...
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    {hiddenMiddle.map((dir) => (
                      <DropdownMenuItem key={dir}>{dir}</DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </>
        )}

        {visibleLast.map((dir) => (
          <Fragment key={dir}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{dir}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </Fragment>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{filename}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
