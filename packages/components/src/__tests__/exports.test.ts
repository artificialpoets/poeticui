import * as core from "../core";
import * as dataDisplay from "../data-display";
import * as feedback from "../feedback";
import * as forms from "../forms";
import * as layout from "../layout";
import * as lib from "../lib";
import * as misc from "../misc";
import * as navigation from "../navigation";
import * as tables from "../tables";

describe("@poeticui/components barrel exports", () => {
  test("core exports", () => {
    expect(core.Button).toBeDefined();
    expect(core.TouchTarget).toBeDefined();
    expect(core.Link).toBeDefined();
  });

  test("data-display exports", () => {
    expect(dataDisplay.Badge).toBeDefined();
    expect(dataDisplay.BadgeButton).toBeDefined();
    expect(dataDisplay.Avatar).toBeDefined();
    expect(dataDisplay.ImageWithFallback).toBeDefined();
    expect(dataDisplay.AvatarButton).toBeDefined();
    expect(dataDisplay.Text).toBeDefined();
    expect(dataDisplay.TextLink).toBeDefined();
    expect(dataDisplay.Strong).toBeDefined();
    expect(dataDisplay.Code).toBeDefined();
    expect(dataDisplay.Card).toBeDefined();
    expect(dataDisplay.DescriptionList).toBeDefined();
    expect(dataDisplay.DescriptionTerm).toBeDefined();
    expect(dataDisplay.DescriptionDetails).toBeDefined();
    expect(dataDisplay.Divider).toBeDefined();
    expect(dataDisplay.Heading).toBeDefined();
    expect(dataDisplay.Subheading).toBeDefined();
    expect(dataDisplay.Skeleton).toBeDefined();
    expect(dataDisplay.Table).toBeDefined();
    expect(dataDisplay.TableHead).toBeDefined();
    expect(dataDisplay.TableBody).toBeDefined();
    expect(dataDisplay.TableRow).toBeDefined();
    expect(dataDisplay.TableHeader).toBeDefined();
    expect(dataDisplay.TableCell).toBeDefined();
  });

  test("forms exports", () => {
    expect(forms.CheckboxGroup).toBeDefined();
    expect(forms.CheckboxField).toBeDefined();
    expect(forms.Checkbox).toBeDefined();
    expect(forms.Combobox).toBeDefined();
    expect(forms.ComboboxOption).toBeDefined();
    expect(forms.ComboboxLabel).toBeDefined();
    expect(forms.ComboboxDescription).toBeDefined();
    expect(forms.Fieldset).toBeDefined();
    expect(forms.Legend).toBeDefined();
    expect(forms.FieldGroup).toBeDefined();
    expect(forms.Field).toBeDefined();
    expect(forms.Label).toBeDefined();
    expect(forms.Input).toBeDefined();
    expect(forms.InputGroup).toBeDefined();
    expect(forms.Listbox).toBeDefined();
    expect(forms.ListboxOption).toBeDefined();
    expect(forms.ListboxLabel).toBeDefined();
    expect(forms.ListboxDescription).toBeDefined();
    expect(forms.RadioGroup).toBeDefined();
    expect(forms.RadioField).toBeDefined();
    expect(forms.Radio).toBeDefined();
    expect(forms.Select).toBeDefined();
    expect(forms.SwitchGroup).toBeDefined();
    expect(forms.SwitchField).toBeDefined();
    expect(forms.Switch).toBeDefined();
    expect(forms.Textarea).toBeDefined();
    expect(forms.DateRangePicker).toBeDefined();
    expect(forms.Calendar).toBeDefined();
  });

  test("navigation exports", () => {
    expect(navigation.Navbar).toBeDefined();
    expect(navigation.NavbarDivider).toBeDefined();
    expect(navigation.NavbarSection).toBeDefined();
    expect(navigation.NavbarSpacer).toBeDefined();
    expect(navigation.NavbarItem).toBeDefined();
    expect(navigation.NavbarLabel).toBeDefined();
    expect(navigation.Sidebar).toBeDefined();
    expect(navigation.SidebarHeader).toBeDefined();
    expect(navigation.SidebarBody).toBeDefined();
    expect(navigation.SidebarFooter).toBeDefined();
    expect(navigation.SidebarSection).toBeDefined();
    expect(navigation.SidebarDivider).toBeDefined();
    expect(navigation.SidebarSpacer).toBeDefined();
    expect(navigation.SidebarHeading).toBeDefined();
    expect(navigation.SidebarItem).toBeDefined();
    expect(navigation.SidebarLabel).toBeDefined();
    expect(navigation.Breadcrumbs).toBeDefined();
    expect(navigation.Pagination).toBeDefined();
    expect(navigation.PaginationPrevious).toBeDefined();
    expect(navigation.PaginationNext).toBeDefined();
    expect(navigation.PaginationList).toBeDefined();
    expect(navigation.PaginationPage).toBeDefined();
    expect(navigation.PaginationGap).toBeDefined();
    expect(navigation.Tabs).toBeDefined();
    expect(navigation.SegmentedTabs).toBeDefined();
    expect(navigation.SegmentedTabsItem).toBeDefined();
  });

  test("feedback exports", () => {
    expect(feedback.Alert).toBeDefined();
    expect(feedback.AlertTitle).toBeDefined();
    expect(feedback.AlertDescription).toBeDefined();
    expect(feedback.AlertBody).toBeDefined();
    expect(feedback.AlertActions).toBeDefined();
    expect(feedback.Dialog).toBeDefined();
    expect(feedback.DialogTitle).toBeDefined();
    expect(feedback.DialogDescription).toBeDefined();
    expect(feedback.DialogBody).toBeDefined();
    expect(feedback.DialogActions).toBeDefined();
  });

  test("misc exports", () => {
    expect(misc.Dropdown).toBeDefined();
    expect(misc.DropdownButton).toBeDefined();
    expect(misc.DropdownMenu).toBeDefined();
    expect(misc.DropdownItem).toBeDefined();
    expect(misc.DropdownHeader).toBeDefined();
    expect(misc.DropdownSection).toBeDefined();
    expect(misc.DropdownHeading).toBeDefined();
    expect(misc.DropdownDivider).toBeDefined();
    expect(misc.DropdownLabel).toBeDefined();
    expect(misc.DropdownDescription).toBeDefined();
    expect(misc.DropdownShortcut).toBeDefined();
    expect(misc.Hint).toBeDefined();
    expect(misc.Popover).toBeDefined();
    expect(misc.PopoverButton).toBeDefined();
    expect(misc.PopoverPanel).toBeDefined();
  });

  test("layout exports", () => {
    expect(layout.DrawerShell).toBeDefined();
    expect(layout.PageHeader).toBeDefined();
    expect(layout.SidebarLayout).toBeDefined();
    expect(layout.StackedLayout).toBeDefined();
  });

  test("tables exports", () => {
    expect(tables.DataTable).toBeDefined();
    expect(tables.FilteredTableShell).toBeDefined();
    expect(tables.TablePaginationFooter).toBeDefined();
    expect(tables.ActionsTableHeader).toBeDefined();
    expect(tables.ActionsTableCell).toBeDefined();
    expect(tables.getSortedHeaderClass).toBeDefined();
    expect(tables.getSortedCellClass).toBeDefined();
    expect(tables.TableFilterTrigger).toBeDefined();
    expect(tables.useFilteredTable).toBeDefined();
  });

  test("lib exports", () => {
    expect(lib.cx).toBeDefined();
    expect(typeof lib.cx).toBe("function");
  });
});
