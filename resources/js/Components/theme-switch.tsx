/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useTheme } from '@/Components/theme-provider'
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const ThemeSwitch = () => {
  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }

  }
  const { setTheme, theme } = useTheme()


    return (
      <div className="mx-auto text-center">
        <Label htmlFor="switch-10" className="sr-only">
          Toggle switch
        </Label>
        <div
          className="group inline-flex items-center gap-2"
          data-state={checked ? "checked" : "unchecked"}
        >
          <span
            id="switch-off-label"
            className="flex-1 cursor-pointer text-right text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
            onClick={() => setTheme('light')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTheme('light');
              }
            }}
            tabIndex={0}
            role="button"
          >
            <Sun size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <Switch
            id="switch-10"
            checked={theme === 'dark'}
            onCheckedChange={toggleSwitch}
            aria-labelledby="switch-off-label switch-on-label"
            aria-label="Toggle between dark and light mode"
          />
          <span
            id="switch-on-label"
            className="flex-1 cursor-pointer text-left text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
            onClick={() => setTheme('dark')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTheme('dark');
              }
            }}
            tabIndex={0}
            role="button"
          >
            <Moon size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </div>
    )
}
