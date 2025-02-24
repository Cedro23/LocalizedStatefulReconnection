# LocalizedStatefulReconnection

This package is a fork of this [git repo](https://github.com/SteveSandersonMS/StatefulReconnection) by [Steve Sanderson](https://github.com/SteveSandersonMS).

Please refer to his repository for the original documentation.

The goal of this fork is to provide a way to localize the texts used in the reconnection dialog.

## Installation

```
dotnet add package LocalizedStatefulReconnection
```

## Usage

In _Imports.razor add:
```csharp
@using Microsoft.Extensions.Localization
@inject IStringLocalizer<App> Loc;
```

In your `App.razor` file add `<LocalizedStatefulReconnection />` before or after your `<Router />`. Example: 
```csharp
<LocalizedStatefulReconnection RejoiningMessage="@Loc["RejoiningMessage"]" CheckInternetMessage="@Loc["CheckInternetMessage"]" ReloadMessage="@Loc["ReloadMessage"]" />

<Router AppAssembly="@typeof(App).Assembly">
    ... leave contents unchanged ...
</Router>
```

## Changelog

### 0.2.0
- Update "Usage" section in README.md: added using statement.
- Reconnect button is always visible.

### 0.1.0
- Framework target bumped to .NET 8.0 from .NET 7.0.

- `StatefulReconnection` is now called `LocalizedStatefulReconnection`.

- Added 3 parameters to the `LocalizedStatefulReconnection` class:
  - `RejoiningMessage`: The text to be displayed in the reconnection dialog.
  - `CheckInternetMessage`: The text to be displayed under the rejoingning message when the reconnection takes too long.
  - `ReloadMessage`: The text of the button to reload the page.