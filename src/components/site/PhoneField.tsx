import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, defaultCountryCode } from "@/lib/countries";

/**
 * Phone entry split into a scrollable international dial-code picker and the
 * local number. The combined E.164-ish value is written to a hidden input so
 * plain form submission keeps working.
 */
export function PhoneField({
  id = "contact-phone",
  name = "phone",
  label = "Phone",
  required = false,
}: {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
}) {
  const [countryKey, setCountryKey] = useState(defaultCountryCode);
  const [local, setLocal] = useState("");

  const country = useMemo(
    () => countries.find((item) => item.code === countryKey) ?? countries[0],
    [countryKey],
  );

  const digits = local.replace(/[^\d]/g, "").replace(/^0+/, "");
  const combined = digits ? `${country.dial} ${digits}` : "";

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5 flex gap-2">
        <Select value={countryKey} onValueChange={setCountryKey}>
          <SelectTrigger
            className="h-11 w-[7.5rem] shrink-0"
            aria-label="Country dialling code"
          >
            <SelectValue aria-label={country.name}>
              <span className="mr-1">{country.flag}</span>
              {country.dial}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {countries.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                <span className="mr-1">{item.flag}</span>
                {item.dial}
                <span className="ml-2 text-muted-foreground">{item.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          placeholder="748 576 025"
          className="h-11 flex-1"
          value={local}
          onChange={(event) => setLocal(event.target.value)}
        />
      </div>
      <input type="hidden" name={name} value={combined} />
      <p className="mt-1 text-xs text-muted-foreground">
        Pick your country code from the list, then type the rest of your number.
        {combined ? ` We will call you on ${combined}.` : ""}
      </p>
    </div>
  );
}
