"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

let frameworks = [
    {
        value: "all",
        label: "All",
        actualValue: "",
    },
    {
        value: "shortlisted",
        label: "Shortlisted",
        actualValue: "true",
    },
    {
        value: "not_shortlisted",
        label: "Not shortlisted",
        actualValue: "false",
    },
];

export default function FilterShortlisted({ value: controlledValue, filterFunc }) {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState("");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleSelect = (actualVal) => {
        if (controlledValue === undefined) {
            setInternalValue(actualVal);
        }
        setOpen(false);
        if (typeof filterFunc === "function") {
            filterFunc(actualVal);
        }
    };

    const currentLabel = frameworks.find((f) => f.actualValue === value)?.label;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Filter by shortlist status"
                    className="w-[180px] justify-between text-xs"
                >
                    {value ? (
                        <span className="truncate">{currentLabel || value}</span>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <IoFilter className="h-3.5 w-3.5" />
                            <span>Shortlist Status</span>
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Filter status..." />
                    <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.label}
                                    onSelect={() => handleSelect(framework.actualValue)}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.actualValue
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
