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
import { Fragment } from "react";
import { useUIStore } from "@/store/uiStore";

const COLLAPSE_THRESHOLD = 4;

interface BreadCrumbProps {
  path: string;
  className?: string;
}

export default function BreadCrumb({ path, className }: BreadCrumbProps) {
  const { expandDir, focusDir } = useUIStore();

  const segments = path.split("/").filter(Boolean);
  const dirs = segments.slice(0, -1);
  const filename = segments[segments.length - 1];

  const dirEntries = dirs.map((name, i) => ({
    name,
    path: dirs.slice(0, i + 1).join("/"),
  }));

  const isCollapsed = dirEntries.length > COLLAPSE_THRESHOLD;
  const visibleFirst = isCollapsed ? dirEntries.slice(0, 1) : dirEntries;
  const hiddenMiddle = isCollapsed ? dirEntries.slice(1, dirEntries.length - 1) : [];
  const visibleLast = isCollapsed ? dirEntries.slice(dirEntries.length - 1) : [];

  const handleDirClick = (dirPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    expandDir(dirPath);
    focusDir(dirPath);
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-[10.5px]">
        {visibleFirst.map((entry) => (
          <Fragment key={entry.path}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => handleDirClick(entry.path, e)}>
                {entry.name}
              </BreadcrumbLink>
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
                    {hiddenMiddle.map((entry) => (
                      <DropdownMenuItem
                        key={entry.path}
                        onClick={() => { expandDir(entry.path); focusDir(entry.path); }}
                      >
                        {entry.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </>
        )}

        {visibleLast.map((entry) => (
          <Fragment key={entry.path}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => handleDirClick(entry.path, e)}>
                {entry.name}
              </BreadcrumbLink>
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
