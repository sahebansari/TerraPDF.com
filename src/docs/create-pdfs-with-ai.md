---
title: "Create PDFs with AI: Step-by-Step"
description: "A step-by-step guide for creating PDF documents with AI: connect TerraPDF.Mcp to Claude Desktop, VS Code, Cursor, or Claude Code with no code, or build your own .NET agent with TerraPDF.Agents."
layout: base.njk
docPage: true
permalink: /docs/create-pdfs-with-ai/
---
# Create PDFs with AI: Step-by-Step

Ask for a document in plain language and get a finished PDF: an invoice, a
report with a chart, a certificate. This guide shows two ways to do it, one
step at a time. No PDF or programming knowledge is needed for the first.

| I want to… | Use | Code needed? |
|------------|-----|--------------|
| Create PDFs by chatting in an AI app I already use (Claude Desktop, VS Code with GitHub Copilot, Cursor, Claude Code) | [TerraPDF.Mcp](#use-terrapdfmcp-in-your-ai-app) | No |
| Build my own program or service where an AI creates PDFs | [TerraPDF.Agents](#build-your-own-pdf-agent-with-terrapdfagents) | A short C# program |

Both are free and open source (MIT), and both use the same TerraPDF engine.

## How it works

Two parts work together:

- **The AI model is the writer.** It understands your request and decides what
  goes in the document: headings, tables, totals, charts.
- **TerraPDF is the printer.** The AI hands it a structured description of the
  document through a tool called `create_pdf`. TerraPDF checks it, lays out
  the pages, and saves a real PDF file.

If the AI's description has a mistake, such as a table row with too many
cells, TerraPDF names the exact problem. The AI fixes it and tries again,
usually without you noticing. TerraPDF only ever saves into the folder you
choose, and it never replaces an existing file: a new version is saved next to
it as `name-2.pdf`.

---

## Use TerraPDF.Mcp in your AI app

TerraPDF.Mcp is an add-on for AI chat apps. It connects through **MCP (Model
Context Protocol)**, the standard way AI apps plug in extra tools. You set it
up once, then ask for PDFs in the chat.

### What you need

- An AI app that supports MCP: **Claude Desktop**, **VS Code with GitHub
  Copilot**, **Cursor**, or **Claude Code**.
- The **.NET 10 SDK** (free). It lets your computer download and run
  TerraPDF.Mcp.

### Step 1: Install .NET 10

1. Download and install the **.NET 10 SDK** from
   [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
   Choose the **SDK**, version **10 or newer**: the `dnx` command used below
   ships with .NET 10.
2. Open a terminal (Windows: Start, then type **Terminal**; macOS:
   Applications, Utilities, **Terminal**) and run:

   ```bash
   dotnet --version
   ```

   A number starting with **10** means you're ready.

### Step 2: Choose a folder for your PDFs

Pick the folder where PDFs should be saved, for example **Documents\PDFs**,
and note its full path. It doesn't need to exist yet; TerraPDF creates it.

- **Write Windows paths with forward slashes**, such as
  `C:/Users/Priya/Documents/PDFs`. Windows accepts them, and backslashes
  would need doubling inside the settings file.
- **Always set this folder.** Some apps start add-ons in a system folder, so
  without it your PDFs could be saved somewhere unexpected.

### Step 3: Connect TerraPDF.Mcp to your app

Every app does the same thing: start TerraPDF with `dnx TerraPDF.Mcp --yes`
and tell it where to save PDFs. The first start downloads TerraPDF
automatically, so it can take a minute.

#### Claude Desktop

1. Open **Settings**, then **Developer**, then **Edit Config**. This opens
   `claude_desktop_config.json`.
2. Add the `mcpServers` section, using your own folder path:

   ```json
   {
     "mcpServers": {
       "terrapdf": {
         "command": "dnx",
         "args": ["TerraPDF.Mcp", "--yes"],
         "env": { "TERRAPDF_OUTPUT_DIR": "C:\\Users\\ansari\\Documents\\PDFs" }
       }
     }
   }
   ```

3. Save the file, then **fully quit Claude Desktop**: right-click its icon in
   the system tray or menu bar and choose **Quit**. Closing the window leaves
   it running. Then reopen it.
4. In a new chat, open the tools menu next to the message box and check that
   **terrapdf** is listed.

> **If the file already has content** (such as a `"preferences"` section),
> keep it and add `"mcpServers"` at the **top level**, next to `"preferences"`,
> not inside it. Claude Desktop ignores a `mcpServers` section nested inside
> another one. Separate the sections with commas:
>
> ```json
> {
>   "preferences": { … },
>   "mcpServers": { "terrapdf": { … } }
> }
> ```
>
> On Windows, the Microsoft Store version of Claude Desktop keeps this file in
> `%LOCALAPPDATA%\Packages\Claude_…\LocalCache\Roaming\Claude\`. **Edit Config**
> always opens the right one.

#### VS Code with GitHub Copilot

1. Open your project folder in VS Code.
2. Create a file named **`mcp.json`** in a folder named **`.vscode`**:

   ```json
   {
     "servers": {
       "terrapdf": {
         "type": "stdio",
         "command": "dnx",
         "args": ["TerraPDF.Mcp", "--yes"],
         "env": { "TERRAPDF_OUTPUT_DIR": "C:\\Users\\Priya\\Documents\\PDFs" }
       }
     }
   }
   ```

3. Save it and click the **Start** link that appears above `"terrapdf"`.
4. Open Copilot Chat, switch to **Agent** mode, and check under the tools icon
   that the TerraPDF tools are enabled.

#### Cursor

1. Open **Cursor Settings**, then **MCP**, then **Add new MCP server**.
2. Paste the same content as for Claude Desktop, with your folder path, and save.
3. Check that **terrapdf** shows as enabled.

#### Claude Code

Run this once in a terminal, with your folder path:

```bash
claude mcp add terrapdf -e TERRAPDF_OUTPUT_DIR=C:/Users/Priya/Documents/PDFs -- dnx TerraPDF.Mcp --yes
```

Then start `claude` and type `/mcp` to check that **terrapdf** is connected.

### Step 4: Ask for a PDF

Type a normal request and mention "PDF", for example:

- *Create a PDF invoice from Northwind Traders to Contoso Ltd: 12 hours of
  consulting at $150/hour and a $1,200 support plan, 10% tax, with a total.*
- *Make a one-page PDF sales report. Revenue by region: North America $430k,
  EMEA $455k, APAC $240k. Add a bar chart and a two-sentence summary.*
- *Create a PDF certificate of completion for Priya Sharma, Advanced Excel
  course, dated today.*

Approve the tool when the app asks for permission. The reply tells you where
the file was saved. To change something, just ask in the same chat, for
example *"make the title blue and add our address at the top"*.

### Optional: use your logo and images

TerraPDF can read images and fonts from one folder you choose. Add a second
setting next to the first:

```json
"env": {
  "TERRAPDF_OUTPUT_DIR": "C:\\Users\\Priya\\Documents\\PDFs",
  "TERRAPDF_ASSET_DIR": "C:\\Users\\Priya\\Documents\\Logos"
}
```

Then ask, for example, *"Put logo.png at the top of the invoice."* TerraPDF
only reads files inside that folder, and only PNG and JPEG images and TrueType
(`.ttf`) fonts. Without this setting, it uses the folder the app started it in.

### Bonus: help writing TerraPDF code

TerraPDF.Mcp also includes a `get_terrapdf_csharp_guide` tool. Ask your coding
assistant to *"write C# code with TerraPDF that generates an invoice PDF"* and
it can look up the verified TerraPDF API first, so the code compiles.

### Troubleshooting TerraPDF.Mcp

| What you see | Likely cause | Fix |
|--------------|--------------|-----|
| **terrapdf** doesn't appear in the app | The app wasn't fully restarted, `mcpServers` is nested inside another section, or the file has a typo | Quit the app completely and reopen it. Put `mcpServers` at the top level. Check that every `{` has a matching `}`, sections are separated by commas, and quotes are straight (`"`), not curly (`“`). |
| An error that `dnx` can't be found | .NET 10 isn't installed, or the app started before it was | Install the .NET 10 SDK, then restart your computer |
| The server fails the first time | The first download hadn't finished | Wait a minute and restart the app |
| The AI answers but no PDF appears | It described the document instead of creating it | Ask it to "create the PDF file" |
| You can't find the PDF | You're looking in a different folder | Check `TERRAPDF_OUTPUT_DIR`; the AI's reply also states the full path |
| `?` instead of some letters | The built-in fonts cover Western European characters only | Use Western European text, or see [Custom Fonts](/docs/custom-fonts/) |

---

## Build your own PDF agent with TerraPDF.Agents

TerraPDF.Agents is a .NET library for developers building their own app or
service in which an AI creates PDFs, such as a support bot that emails
invoices or a reporting service. You write a short C# program; the AI and
TerraPDF do the rest. The example uses OpenAI; any provider that works with
Microsoft.Extensions.AI works the same way.

### What you need

- The **.NET SDK**, version 8 or newer (free).
- An **API key** from an AI provider. This example uses
  [OpenAI](https://platform.openai.com), which charges per use; a typical
  document costs a fraction of a cent.

### Step 1: Install .NET

Install the .NET SDK from
[dotnet.microsoft.com/download](https://dotnet.microsoft.com/download), then
check it in a terminal with `dotnet --version`.

### Step 2: Store your API key safely

Create an API key in your provider's dashboard, then store it as an
environment variable, so it never appears in your code.

- **Windows:**

  ```bash
  setx OPENAI_API_KEY "sk-paste-your-key-here"
  ```

  Then **close the terminal and open a new one**; the setting only applies to
  new windows.
- **macOS or Linux:**

  ```bash
  export OPENAI_API_KEY="sk-paste-your-key-here"
  ```

Keep the key private, like a password.

### Step 3: Create the project

Run these commands one at a time:

```bash
dotnet new console -n MyPdfAgent
cd MyPdfAgent
dotnet add package TerraPDF.Agents
dotnet add package Microsoft.Agents.AI
dotnet add package Microsoft.Extensions.AI.OpenAI
```

They create an empty program, then add TerraPDF's PDF tools, Microsoft's
agent framework (which connects an AI model to tools), and the OpenAI
connector.

### Step 4: Write the program

Replace everything in `Program.cs` with:

```csharp
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;
using TerraPDF.Agents.Tools;

// 1. Your AI provider key, read from the environment variable set in Step 2.
string apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    ?? throw new InvalidOperationException("Set the OPENAI_API_KEY environment variable first.");

// 2. The AI model that does the thinking.
IChatClient chatClient = new OpenAIClient(apiKey)
    .GetChatClient("gpt-4o-mini")
    .AsIChatClient();

// 3. The TerraPDF tools. PDFs are saved into a folder called "pdfs".
var pdfTools = new TerraPdfTools(new TerraPdfToolOptions { OutputDirectory = "pdfs" });

// 4. The agent: the AI model plus the PDF tools.
AIAgent agent = chatClient.AsAIAgent(
    instructions: "You create well-formatted PDF documents. Always use the create_pdf tool, " +
                  "then tell the user where the file was saved.",
    tools: [.. pdfTools.AsAIFunctions()]);

// 5. Ask for a document in plain language.
Console.Write("What PDF would you like? > ");
string request = Console.ReadLine() ?? "";

Console.WriteLine(await agent.RunAsync(request));
```

What each part does:

1. **Reads your key** from the environment variable.
2. **Chooses the AI model.** You can use any model name your account offers.
3. **Sets up TerraPDF** and the folder where PDFs are saved.
4. **Creates the agent**: the model, the PDF tools, and a short job description.
5. **Asks what you want**, passes it to the agent, and prints the reply.

### Step 5: Run it

```bash
dotnet run
```

When you see `What PDF would you like? >`, type a request such as *"Create an
invoice from Northwind Traders to Contoso Ltd for 12 hours of consulting at
$150 per hour, with 10% tax and a total."* The agent replies with the saved
file's location, inside the `pdfs` folder.

### Other agent frameworks

The same tools plug into other .NET AI frameworks with one line:

```csharp
// Semantic Kernel (the model sees terrapdf_create_pdf and terrapdf_get_pdf_document_format)
kernel.Plugins.AddFromFunctions("terrapdf", pdfTools.AsAIFunctions().Select(f => f.AsKernelFunction()));

// Any Microsoft.Extensions.AI IChatClient with function invocation
var options = new ChatOptions { Tools = [.. pdfTools.AsAIFunctions()] };
```

`TerraPdfToolOptions` also controls the image folder (`AssetDirectory`),
custom storage such as cloud uploads (`SaveAsync`), and size limits. See
[TerraPDF for AI Agents](/docs/ai-agents/#terrapdfagents-for-net-agents) for
the options and the security model.

### Troubleshooting TerraPDF.Agents

| What you see | Likely cause | Fix |
|--------------|--------------|-----|
| `Set the OPENAI_API_KEY environment variable first.` | The program can't find your key | Redo Step 2, then open a new terminal |
| `dotnet` is not recognised | .NET isn't installed, or the terminal was opened before installing | Install .NET and open a new terminal |
| An error mentioning **401** or an invalid API key | The key is wrong or revoked | Create a new key and redo Step 2 |
| An error mentioning **429** or quota | No credit on the account, or a rate limit | Add billing credit, or wait a minute |
| The agent answers but no PDF appears | It described the document instead of creating it | Ask it to "create the PDF file" |
| `?` instead of some letters | The built-in fonts cover Western European characters only | Use Western European text, or see [Custom Fonts](/docs/custom-fonts/) |

---

## Next steps

- [TerraPDF for AI Agents](/docs/ai-agents/): the technical reference, with
  the full API contract, the TerraPDF skill for coding assistants, and more
  client configurations.
- [Samples](/samples/): complete example documents with their C# source.
- [Getting Started](/docs/): write PDF code with TerraPDF directly.
