import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface FilterPanelProps {
    filters: {
        label: string;
        options: { id: string; name: string }[];
        selected: string[];
        onChange: (id: string) => void;
    }[];
    showPriceSlider?: boolean;
    priceRange?: [number, number];
    selectedPriceRange?: [number, number];
    onPriceChange?: (value: [number, number]) => void;
}

export default function FilterPanel({filters,
    showPriceSlider = false,
    priceRange = [0, 0],
    selectedPriceRange = [0, 0],
    onPriceChange = () => {},
}: FilterPanelProps) {
    return (
    <div className="space-y-6">
        {filters.map((filter) => (
        <div key={filter.label}>
            <h3 className="font-medium text-gray-900 mb-3">{filter.label}</h3>
            <div className="space-y-2">
            {filter.options.map((option) => (
                <label
                    key={option.id}
                    className="flex items-center gap-2 cursor-pointer text-black"
                >
                <Checkbox
                    id={option.id}
                    checked={filter.selected.includes(option.id)}
                    onCheckedChange={() => filter.onChange(option.id)}
                />
                {option.name}
                </label>
            ))}
            </div>
        </div>
        ))}

        {showPriceSlider && (
        <div>
            <h3 className="font-medium text-gray-900 mb-3">Price</h3>
            <Slider
                min={priceRange[0]}
                max={priceRange[1]}
                step={0.1}
                value={selectedPriceRange}
                onValueChange={onPriceChange}
                className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${selectedPriceRange[0]}</span>
                <span>${selectedPriceRange[1]}</span>
            </div>
        </div>
        )}
    </div>
    );
}