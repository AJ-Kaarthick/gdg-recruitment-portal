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

const priorities = [
    {
        value: "all",
        label: "All Priorities",
        actualValue: "",
    },
    {
        value: "1",
        label: "Priority 1 (P1)",
        actualValue: "1",
    },
    {
        value: "2",
        label: "Priority 2 (P2)",
        actualValue: "2",
    },
    {
        value: "not_set",
        label: "Not set",
        actualValue: "not_set",
    },
];

export default function FilterPriority({ value: controlledValue, filterFunc }) {
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

    const currentLabel = priorities.find((p) => p.actualValue === value)?.label;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Filter by priority"
                    className="w-[160px] justify-between text-xs"
                >
                    {value ? (
                        <span className="truncate">{currentLabel || value}</span>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <IoFilter className="h-3.5 w-3.5" />
                            <span>Priority</span>
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Filter priority..." />
                    <CommandList>
                        <CommandEmpty>No priority option found.</CommandEmpty>
                        <CommandGroup>
                            {priorities.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => handleSelect(item.actualValue)}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.actualValue
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
