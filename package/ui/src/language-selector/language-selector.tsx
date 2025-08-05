import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@package/shadcn";
import ReactCountryFlag from "react-country-flag";

type SelectProps = React.ComponentProps<typeof Select>;

type Language<L extends string> = { code: L } & { label: string };

type Props<L extends string> = SelectProps & { languages: Language<L>[]; ariaLabel: string };

function UILanguageSelector<L extends string>({ value, onValueChange, languages, ariaLabel }:
Props<L>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-background dark:bg-background cursor-pointer" aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-auto">
        {languages.map(lang => (
          <SelectItem className="flex items-center cursor-pointer" value={lang.code} key={lang.label}>
            <ReactCountryFlag
              countryCode={
                lang.code.split("-")[1]
              }
              svg
              alt={lang.label}
            />
            <span aria-hidden className="hidden lg:block">{lang.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default UILanguageSelector;
