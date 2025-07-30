import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@package/shadcn";
import ReactCountryFlag from "react-country-flag";

type SelectProps = React.ComponentProps<typeof Select>;

type Language<L extends string> = { code: L } & { label: string };

type Props<L extends string> = SelectProps & { languages: Language<L>[] };

function UILanguageSelector<L extends string>({ value, onValueChange, languages }:
Props<L>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-background dark:bg-background cursor-pointer">
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
              aria-label={lang.label}
            />
            <span aria-hidden className="hidden lg:block">{lang.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default UILanguageSelector;
