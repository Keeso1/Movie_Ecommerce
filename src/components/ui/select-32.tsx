import { Label } from "@/components/ui/label";
import type { Option } from "@/components/ui/multi-select";
import MultipleSelector from "@/components/ui/multi-select";

const MultipleSelectDemo = ({
  options,
  values,
}: {
  options: Option[];
  values: string[] | undefined;
}) => {
  const formattedValues = values
    ? values.map((value) => ({
        label: value.value,
        value: value.value,
      }))
    : undefined;

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label>Multiselect</Label>
      <MultipleSelector
        commandProps={{
          label: "Select categories",
        }}
        value={formattedValues}
        defaultOptions={options}
        placeholder="Select categories"
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        className="w-full"
      />
      <p
        className="text-muted-foreground text-xs"
        role="region"
        aria-live="polite"
      >
        Inspired by{" "}
        <a
          href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
          className="hover:text-primary underline"
          target="_blank"
        >
          shadcn/ui expressions
        </a>
      </p>
    </div>
  );
};

export default MultipleSelectDemo;
