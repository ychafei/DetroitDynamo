declare module "@/components/ui/accordion" {
  import * as React from "react";
  export const Accordion: React.ComponentType<any>;
  export const AccordionItem: React.ComponentType<any>;
  export const AccordionTrigger: React.ComponentType<any>;
  export const AccordionContent: React.ComponentType<any>;
}

declare module "@/components/ui/alert-dialog" {
  import * as React from "react";
  export const AlertDialog: React.ComponentType<any>;
  export const AlertDialogPortal: React.ComponentType<any>;
  export const AlertDialogOverlay: React.ComponentType<any>;
  export const AlertDialogTrigger: React.ComponentType<any>;
  export const AlertDialogContent: React.ComponentType<any>;
  export const AlertDialogHeader: React.ComponentType<any>;
  export const AlertDialogFooter: React.ComponentType<any>;
  export const AlertDialogTitle: React.ComponentType<any>;
  export const AlertDialogDescription: React.ComponentType<any>;
  export const AlertDialogAction: React.ComponentType<any>;
  export const AlertDialogCancel: React.ComponentType<any>;
}

declare module "@/components/ui/badge" {
  import * as React from "react";
  export const Badge: React.ComponentType<any>;
  export const badgeVariants: (...args: any[]) => string;
}

declare module "@/components/ui/button" {
  import * as React from "react";
  export const Button: React.ComponentType<any>;
  export const buttonVariants: (...args: any[]) => string;
}

declare module "@/components/ui/calendar" {
  import * as React from "react";
  export const Calendar: React.ComponentType<any>;
}

declare module "@/components/ui/checkbox" {
  import * as React from "react";
  export const Checkbox: React.ComponentType<any>;
}

declare module "@/components/ui/confirm-dialog" {
  import * as React from "react";
  export const ConfirmDialog: React.ComponentType<any>;
  export function useConfirm(): {
    confirm: (options: any) => Promise<boolean>;
    dialog: React.ReactNode;
  };
}

declare module "@/components/ui/data-table" {
  import * as React from "react";
  export const DataTable: React.ComponentType<any>;
}

declare module "@/components/ui/dialog" {
  import * as React from "react";
  export const Dialog: React.ComponentType<any>;
  export const DialogPortal: React.ComponentType<any>;
  export const DialogOverlay: React.ComponentType<any>;
  export const DialogTrigger: React.ComponentType<any>;
  export const DialogClose: React.ComponentType<any>;
  export const DialogContent: React.ComponentType<any>;
  export const DialogHeader: React.ComponentType<any>;
  export const DialogFooter: React.ComponentType<any>;
  export const DialogTitle: React.ComponentType<any>;
  export const DialogDescription: React.ComponentType<any>;
}

declare module "@/components/ui/dropdown-menu" {
  import * as React from "react";
  export const DropdownMenu: React.ComponentType<any>;
  export const DropdownMenuTrigger: React.ComponentType<any>;
  export const DropdownMenuContent: React.ComponentType<any>;
  export const DropdownMenuItem: React.ComponentType<any>;
  export const DropdownMenuCheckboxItem: React.ComponentType<any>;
  export const DropdownMenuRadioItem: React.ComponentType<any>;
  export const DropdownMenuLabel: React.ComponentType<any>;
  export const DropdownMenuSeparator: React.ComponentType<any>;
  export const DropdownMenuShortcut: React.ComponentType<any>;
  export const DropdownMenuGroup: React.ComponentType<any>;
  export const DropdownMenuPortal: React.ComponentType<any>;
  export const DropdownMenuSub: React.ComponentType<any>;
  export const DropdownMenuSubContent: React.ComponentType<any>;
  export const DropdownMenuSubTrigger: React.ComponentType<any>;
  export const DropdownMenuRadioGroup: React.ComponentType<any>;
}

declare module "@/components/ui/input" {
  import * as React from "react";
  export const Input: React.ComponentType<any>;
}

declare module "@/components/ui/label" {
  import * as React from "react";
  export const Label: React.ComponentType<any>;
}

declare module "@/components/ui/select" {
  import * as React from "react";
  export const Select: React.ComponentType<any>;
  export const SelectGroup: React.ComponentType<any>;
  export const SelectValue: React.ComponentType<any>;
  export const SelectTrigger: React.ComponentType<any>;
  export const SelectContent: React.ComponentType<any>;
  export const SelectLabel: React.ComponentType<any>;
  export const SelectItem: React.ComponentType<any>;
  export const SelectSeparator: React.ComponentType<any>;
  export const SelectScrollUpButton: React.ComponentType<any>;
  export const SelectScrollDownButton: React.ComponentType<any>;
}

declare module "@/components/ui/separator" {
  import * as React from "react";
  export const Separator: React.ComponentType<any>;
}

declare module "@/components/ui/sheet" {
  import * as React from "react";
  export const Sheet: React.ComponentType<any>;
  export const SheetPortal: React.ComponentType<any>;
  export const SheetOverlay: React.ComponentType<any>;
  export const SheetTrigger: React.ComponentType<any>;
  export const SheetClose: React.ComponentType<any>;
  export const SheetContent: React.ComponentType<any>;
  export const SheetHeader: React.ComponentType<any>;
  export const SheetFooter: React.ComponentType<any>;
  export const SheetTitle: React.ComponentType<any>;
  export const SheetDescription: React.ComponentType<any>;
}

declare module "@/components/ui/skeleton" {
  import * as React from "react";
  export const Skeleton: React.ComponentType<any>;
}

declare module "@/components/ui/switch" {
  import * as React from "react";
  export const Switch: React.ComponentType<any>;
}

declare module "@/components/ui/table" {
  import * as React from "react";
  export const Table: React.ComponentType<any>;
  export const TableHeader: React.ComponentType<any>;
  export const TableBody: React.ComponentType<any>;
  export const TableFooter: React.ComponentType<any>;
  export const TableHead: React.ComponentType<any>;
  export const TableRow: React.ComponentType<any>;
  export const TableCell: React.ComponentType<any>;
  export const TableCaption: React.ComponentType<any>;
}

declare module "@/components/ui/tabs" {
  import * as React from "react";
  export const Tabs: React.ComponentType<any>;
  export const TabsList: React.ComponentType<any>;
  export const TabsTrigger: React.ComponentType<any>;
  export const TabsContent: React.ComponentType<any>;
}

declare module "@/components/ui/textarea" {
  import * as React from "react";
  export const Textarea: React.ComponentType<any>;
}

declare module "@/components/ui/toast" {
  import * as React from "react";
  export const ToastProvider: React.ComponentType<any>;
  export const ToastViewport: React.ComponentType<any>;
  export const Toast: React.ComponentType<any>;
  export const ToastAction: React.ComponentType<any>;
  export const ToastClose: React.ComponentType<any>;
  export const ToastTitle: React.ComponentType<any>;
  export const ToastDescription: React.ComponentType<any>;
}

declare module "@/components/ui/toggle" {
  import * as React from "react";
  export const Toggle: React.ComponentType<any>;
  export const toggleVariants: (...args: any[]) => string;
}

declare module "@/components/ui/tooltip" {
  import * as React from "react";
  export const Tooltip: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
}

declare module "@/components/ui/use-toast" {
  export const useToast: () => any;
  export const toast: any;
}
