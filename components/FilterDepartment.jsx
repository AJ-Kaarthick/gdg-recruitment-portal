"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { reviews } from "@/constants";
import { getDepartmentDisplayName } from "@/lib/departments";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

let frameworks = [];

reviews.forEach(
    (r, index) =>
        (frameworks[index] = {
            value: r.name,
            label: getDepartmentDisplayName(r.name),
        })
);

frameworks.push({
    value: "Video Editing",
    label: "Video Editing",
});

export default function FilterDepartment({ value: controlledValue, filterFunc }) {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState("");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleSelect = (deptVal) => {
        const nextValue = deptVal === value ? "" : deptVal;
        if (controlledValue === undefined) {
            setInternalValue(nextValue);
        }
        setOpen(false);
        if (typeof filterFunc === "function") {
            filterFunc(nextValue);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Filter by department"
                    className="w-[200px] justify-between text-xs"
                >
                    {value ? (
                        <span className="truncate">
                            {frameworks.find((f) => f.value === value)?.label || value}
                        </span>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <IoFilter className="h-3.5 w-3.5" />
                            <span>Department</span>
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search department..." />
                    <CommandList>
                        <CommandEmpty>No department found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                key="all-departments"
                                value="all departments all"
                                onSelect={() => handleSelect("")}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        !value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                All Departments
                            </CommandItem>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={`${framework.label} ${framework.value}`}
                                    onSelect={() => handleSelect(framework.value)}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
