---
title: Markdown基本语法与扩展语法
date: '2019-07-07'
spoiler: 博客文章的编写利器
---

记录Markdown基本的和扩展的语法, 主要用于博客样式实时调整和备忘.

内容来自[这里(基本语法)](https://www.markdownguide.org/basic-syntax/#code){target=_blank}和[这里(扩展语法)](https://www.markdownguide.org/extended-syntax/#alignment){target=_blank}.

## Overview

Nearly all Markdown applications support the basic syntax outlined in John Gruber’s original design document. There are minor variations and discrepancies between Markdown processors — those are noted inline wherever possible.

## Headings

To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three (\<h3>), use three number signs (e.g., ### My Header).

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| # Heading level 1 | \<h1>Heading level 1\</h1> | <h1>Heading level 1</h1> |
| ## Heading level 2 | \<h2>Heading level 2\</h2> | <h2>Heading level 2</h2> |
| ### Heading level 3 | \<h3>Heading level 3\</h3> | <h3>Heading level 3</h3> |
| #### Heading level 4 | \<h4>Heading level 4\</h4> | <h4>Heading level 4</h4> |
| ##### Heading level 5 | \<h5>Heading level 5\</h5> | <h5>Heading level 5</h5> |
| ###### Heading level 6 | \<h6>Heading level 6\</h6> | <h6>Heading level 6</h6> |

## Alternate Syntax

Alternatively, on the line below the text, add any number of == characters for heading level 1 or -- characters for heading level 2.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| Heading level 1<br>=============== | \<h1>Heading level 1\</h1> | <h1>Heading level 1</h1> |
| Heading level 2<br>--------------- | \<h2>Heading level 2\</h2> | <h2>Heading level 2</h2> |

## Paragraphs

To create paragraphs, use a blank line to separate one or more lines of text. You should not indent paragraphs with spaces or tabs.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| I really like using Markdown. | \<p>I really like using Markdown.\</p> | <p>I really like using Markdown.</p> |
| I think I'll use it to format all of my documents from now on. | \<p>I think I'll use it to format all of my documents from now on.\</p> | <p>I think I'll use it to format all of my documents from now on.</p> |

## Line Breaks

To create a line break (\<br>), end a line with two or more spaces, and then type return.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| This is the first line.<br><br>And this is the second line. | \<p>This is the first line.\<br>And this is the second line.\</p> | <p>This is the first line.<br>And this is the second line.</p> |

## Emphasis

You can add emphasis by making text bold or italic.

## Bold

To bold text, add two asterisks or underscores before and after a word or phrase. To bold the middle of a word for emphasis, add two asterisks without spaces around the letters.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| I just love \*\*bold text\*\*. | I just love \<strong>bold text\</strong>. | I just love <strong>bold text</strong>. |
| I just love \_\_bold text\_\_. | I just love \<strong>bold text\</strong>. | I just love <strong>bold text</strong>. |
| Love\*\*is\*\*bold | Love\<strong>is\</strong>bold | Love<strong>is</strong>bold |

## Italic

To italicize text, add one asterisk or underscore before and after a word or phrase. To italicize the middle of a word for emphasis, add one asterisk without spaces around the letters.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| Italicized text is the \*cat's meow\*. | Italicized text is the \<em>cat's meow\</em>. | Italicized text is the <em>cat's meow</em>. |
| Italicized text is the \_cat's meow\_. | Italicized text is the \<em>cat's meow\</em>. | Italicized text is the <em>cat's meow</em>. |
| A\*cat\*meow | 	A\<em>cat\</em>meow | 	A<em>cat</em>meow |

## Bold and Italic

To emphasize text with bold and italics at the same time, add three asterisks or underscores before and after a word or phrase.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| This text is \*\*\*really important\*\*\*. | This text is \<strong>\<em>really important\</em>\</strong>. | This text is <strong><em>really important</em></strong>. |
| This text is \_\_\_really important\_\_\_. | This text is \<strong>\<em>really important\</em>\</strong>. | This text is <strong><em>really important</em></strong>. |
| This text is \_\_\*really important\*\_\_. | This text is \<strong>\<em>really important\</em>\</strong>. | This text is <strong><em>really important</em></strong>. |
| This text is \*\*\_really important\_\*\*. | This text is \<strong>\<em>really important\</em>\</strong>. | This text is <strong><em>really important</em></strong>. |

## Blockquotes

To create a blockquote, add a > in front of a paragraph.

```text
> Dorothy followed her through many of the beautiful rooms in her castle.
```

The rendered output looks like this:
> Dorothy followed her through many of the beautiful rooms in her castle.

## Blockquotes with Multiple Paragraphs

Blockquotes can contain multiple paragraphs. Add a > on the blank lines between the paragraphs.

```text
> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```

The rendered output looks like this:

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

## Nested Blockquotes

Blockquotes can be nested. Add a >> in front of the paragraph you want to nest.

```text
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.
```
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

## Blockquotes with Other Elements

Blockquotes can contain other Markdown formatted elements. Not all elements can be used — you’ll need to experiment to see which ones work.

```text
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.
```

The rendered output looks like this:

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

## Lists

You can organize items into ordered and unordered lists.

## Ordered Lists

To create an ordered list, add line items with numbers followed by periods. The numbers don’t have to be in numerical order, but the list should start with the number one.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| 1. First item<br>2. Second item<br>3. Third item<br>4. Fourth item | \<ol><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ol> | <ol><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ol> |
| 1. First item<br>1. Second item<br>1. Third item<br>1. Fourth item | \<ol><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ol> | <ol><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ol> |
| 1. First item<br>8. Second item<br>2. Third item<br>5. Fourth item | \<ol><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ol> | <ol><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ol> |
| 1. First item<br>2. Second item<br>3. Third item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.Indented item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Indented item<br>4. Fourth item | \<ol><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item<br>\<ol><br>\<li>Indented item\</li><br>\<li>Indented item\</li><br>\</ol><br>\</li><br>\<li>Fourth item\</li><br>\</ol> | <ol><li>First item</li><li>Second item</li><li>Third item<ol><li>Indented item</li><li>Indented item</li></ol></li><li>Fourth item</li></ol> |

## Unordered Lists

To create an unordered list, add dashes (-), asterisks (*), or plus signs (+) in front of line items. Indent one or more items to create a nested list.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| \- First item<br>\- Second item<br>\- Third item<br>\- Fourth item | \<ul><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ul> | <ul><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ul> |
| \* First item<br>\* Second item<br>\* Third item<br>\* Fourth item | \<ul><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ul> | <ul><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ul> |
| \+ First item<br>\* Second item<br>\- Third item<br>\+ Fourth item | \<ul><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ul> | <ul><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ul> |
| 1. First item<br>8. Second item<br>2. Third item<br>5. Fourth item | \<ul><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item\</li><br>\<li>Fourth item\</li><br>\</ul> | <ul><li>First item</li><li>Second item</li><li>Third item</li><li>Fourth item</li></ul> |
| \- First item<br>\- Second item<br>\- Third item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\-Indented item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\- Indented item<br>\- Fourth item | \<ul><br>\<li>First item\</li><br>\<li>Second item\</li><br>\<li>Third item<br>\<ul><br>\<li>Indented item\</li><br>\<li>Indented item\</li><br>\</ul><br>\</li><br>\<li>Fourth item\</li><br>\</ul> | <ul><li>First item</li><li>Second item</li><li>Third item<ul><li>Indented item</li><li>Indented item</li></ul></li><li>Fourth item</li></ul> |

## Adding Elements in Lists

To add another element in a list while preserving the continuity of the list, indent the element four spaces or one tab, as shown in the following examples.

### Paragraphs

```text
*   This is the first list item.
*   Here's the second list item.

    I need to add another paragraph below the second list item.

*   And here's the third list item.
```
The rendered output looks like this:

*   This is the first list item.
*   Here's the second list item.

    I need to add another paragraph below the second list item.

*   And here's the third list item.

### Blockquotes

```text
*   This is the first list item.
*   Here's the second list item.

    > A blockquote would look great below the second list item.

*   And here's the third list item.
```

The rendered output looks like this:

*   This is the first list item.
*   Here's the second list item.

    > A blockquote would look great below the second list item.

*   And here's the third list item.

### Code Blocks

Code blocks are normally indented four spaces or one tab. When they’re in a list, indent them eight spaces or two tabs.

```text
1.  Open the file.
2.  Find the following code block on line 21:

        <html>
          <head>
            <title>Test</title>
          </head>

3.  Update the title to match the name of your website.
```

The rendered output looks like this:

1.  Open the file.
2.  Find the following code block on line 21:
```html
        <html>
          <head>
            <title>Test</title>
          </head>
```
3.  Update the title to match the name of your website.

### Images

```text
1.  Open the file containing the Linux mascot.
2.  Marvel at its beauty.

    ![Tux, the Linux mascot](./tux.png)

3.  Close the file.
```

The rendered output looks like this:

1.  Open the file containing the Linux mascot.
2.  Marvel at its beauty.

    ![Tux, the Linux mascot](./tux.png)

3.  Close the file.

## Code

To denote a word or phrase as code, enclose it in backticks (`).

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| At the command prompt, type \`nano\`. | At the command prompt, type \<code>nano\</code>. | At the command prompt, type <code>nano</code>. |

## Escaping Backticks

If the word or phrase you want to denote as code includes one or more backticks, you can escape it by enclosing the word or phrase in double backticks (``).

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
|  \`\`Use \`code\` in your Markdown file.\`\`  | \<code>Use \`code\` in your Markdown file.\</code> | <code>Use \`code\` in your Markdown file.</code>  |


## Code Blocks

To create code blocks, indent every line of the block by at least four spaces or one tab.

```text
<html>
  <head>
  </head>
</html>
```

The rendered output looks like this:

```html
<html>
  <head>
  </head>
</html>
```

## Horizontal Rules

To create a horizontal rule, use three or more asterisks (***), dashes (---), or underscores (___) on a line by themselves.

```text
***

---

_________________
```

The rendered output of all three looks identical:

***

## Links

To create a link, enclose the link text in brackets (e.g., [Duck Duck Go]) and then follow it immediately with the URL in parentheses (e.g., (https://duckduckgo.com)).

```text
My favorite search engine is [Duck Duck Go](https://duckduckgo.com).
```

The rendered output looks like this:

My favorite search engine is [Duck Duck Go](https://duckduckgo.com).

## Adding Titles

You can optionally add a title for a link. This will appear as a tooltip when the user hovers over the link. To add a title, enclose it in parentheses after the URL.

```text
My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").
```

The rendered output looks like this:

My favorite search engine is [Duck Duck Go](https://duckduckgo.com "The best search engine for privacy").

## URLs and Email Addresses

To quickly turn a URL or email address into a link, enclose it in angle brackets.

```text
<https://www.markdownguide.org>
<fake@example.com>
```

The rendered output looks like this:

<https://www.markdownguide.org>

<fake@example.com>

## Formatting Links

To emphasize links, add asterisks before and after the brackets and parentheses. To denote links as code, add backticks in the brackets.

```text
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).
```

The rendered output looks like this:

I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).

## Reference-style Links

Reference-style links are a special kind of link that make URLs easier to display and read in Markdown. Reference-style links are constructed in two parts: the part you keep inline with your text and the part you store somewhere else in the file to keep the text easy to read.

## An Example Putting the Parts Together

Say you add a URL as a standard URL link to a paragraph and it looks like this in Markdown:

```text
In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and that means comfort.
```

Though it may point to interesting additional information, the URL as displayed really doesn’t add much to the existing raw text other than making it harder to read. To fix that, you could format the URL like this instead:

```text
In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole][1], and that means comfort.

[1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> "Hobbit lifestyles"
```

In both instances above, the rendered output would be identical:

>In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
eat: it was a [hobbit-hole](https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"), and that means comfort.

and the HTML for the link would be:

```text
<a href="https://en.wikipedia.org/wiki/Hobbit#Lifestyle" title="Hobbit lifestyles">hobbit-hole</a>
```

## Images

To add an image, add an exclamation mark (!), followed by alt text in brackets, and the path or URL to the image asset in parentheses. You can optionally add a title after the URL in the parentheses.

```text
![Philadelphia's Magic Gardens. This place was so cool!](./philly-magic-garden.jpg "Philadelphia's Magic Gardens")
```
The rendered output looks like this:

![Philadelphia's Magic Gardens. This place was so cool!](./philly-magic-garden.jpg "Philadelphia's Magic Gardens")

## Linking Images

To add a link to an image, enclose the Markdown for the image in brackets, and then add the link in parentheses.

```text
[![An old rock in the desert](./shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist-Qv3rFw-34mt9F-a9Cmfy-5Ha3Zi-9msKdv-o3hgjr-hWpUte-4WMsJ1-KUQ8N-deshUb-vssBD-6CQci6-8AFCiD-zsJWT-nNfsgB-dPDwZJ-bn9JGn-5HtSXY-6CUhAL-a4UTXB-ugPum-KUPSo-fBLNm-6CUmpy-4WMsc9-8a7D3T-83KJev-6CQ2bK-nNusHJ-a78rQH-nw3NvT-7aq2qf-8wwBso-3nNceh-ugSKP-4mh4kh-bbeeqH-a7biME-q3PtTf-brFpgb-cg38zw-bXMZc-nJPELD-f58Lmo-bXMYG-bz8AAi-bxNtNT-bXMYi-bXMY6-bXMYv)
```

The rendered output looks like this:

[![An old rock in the desert](./shiprock.jpg "Shiprock, New Mexico by Beau Rogers")](https://www.flickr.com/photos/beaurogers/31833779864/in/photolist-Qv3rFw-34mt9F-a9Cmfy-5Ha3Zi-9msKdv-o3hgjr-hWpUte-4WMsJ1-KUQ8N-deshUb-vssBD-6CQci6-8AFCiD-zsJWT-nNfsgB-dPDwZJ-bn9JGn-5HtSXY-6CUhAL-a4UTXB-ugPum-KUPSo-fBLNm-6CUmpy-4WMsc9-8a7D3T-83KJev-6CQ2bK-nNusHJ-a78rQH-nw3NvT-7aq2qf-8wwBso-3nNceh-ugSKP-4mh4kh-bbeeqH-a7biME-q3PtTf-brFpgb-cg38zw-bXMZc-nJPELD-f58Lmo-bXMYG-bz8AAi-bxNtNT-bXMYi-bXMY6-bXMYv)

## Escaping Characters

To display a literal character that would otherwise be used to format text in a Markdown document, add a backslash (\) in front of the character.

```text
\* Without the backslash, this would be a bullet in an unordered list.
```

The rendered output looks like this:

\* Without the backslash, this would be a bullet in an unordered list.

## Characters You Can Escape

You can use a backslash to escape the following characters.

| Character | Name |
|  :----  | :----  |
|  \  | backslash  |
|  `  | backtick  |
|  *  | asterisk  |
|  _  | underscore  |
|  {}  | curly braces  |
|  []  | brackets  |
|  #  | parentheses  |
|  +	  | pound sign  |
|  -  | plus sign  |
|  .  | minus sign (hyphen)  |
|  !  | dot  |
|  \|  | pipe  |

## HTML

Many Markdown applications allow you to use HTML tags in Markdown-formatted text. This is helpful if you prefer certain HTML tags to Markdown syntax. For example, some people find it easier to use HTML tags for images. Using HTML is also helpful when you need to change the attributes of an element, like specifying the color of text or changing the width of an image.

To use HTML, place the tags in the text of your Markdown-formatted file.

```text
This **word** is bold. This <em>word</em> is italic.
```

The rendered output looks like this:

This **word** is bold. This <em>word</em> is italic.

## Limitations

For security reasons, not all Markdown applications support HTML in Markdown documents. When in doubt, check your Markdown application’s documentation. Some applications support only a subset of HTML tags.

Use blank lines to separate block-level HTML elements like \<div\>, \<table\>, \<pre\>, and \<p\> from the surrounding content. Try not to indent the tags with tabs or spaces — that can interfere with the formatting.

You can’t use Markdown syntax inside block-level HTML tags. For example, \<p\>italic and \*\*bold\*\*\</p\> won’t work.

***

## Tables

To add a table, use three or more hyphens (---) to create each column’s header, and use pipes (|) to separate each column. You can optionally add pipes on either end of the table.

```text
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
```

The rendered output looks like this:

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

Cell widths can vary, as shown below. The rendered output will look the same.

```text
| Syntax | Description |
| --- | ----------- |
| Header | Title |
| Paragraph | Text |
```

## Alignment

You can align text in the columns to the left, right, or center by adding a colon (:) to the left, right, or on both side of the hyphens within the header row.

```text
| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
```

The rendered output looks like this:

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

## Formatting Text in Tables

You can format the text within tables. For example, you can add links, code (words or phrases in backticks (`) only, not code blocks), and emphasis.

You can’t add headings, blockquotes, lists, horizontal rules, images, or HTML tags.

## Escaping Pipe Characters in Tables

You can display a pipe (|) character in a table by using its HTML character code (\&#124;).

## Fenced Code Blocks

The basic Markdown syntax allows you to create code blocks by indenting lines by four spaces or one tab. If you find that inconvenient, try using fenced code blocks. Depending on your Markdown processor or editor, you’ll use three backticks (```) or three tildes (~~~) on the lines before and after the code block. The best part? You don’t have to indent any lines!

```text
```//
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```//
```

The rendered output looks like this:

```text
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## Syntax Highlighting

Many Markdown processors support syntax highlighting for fenced code blocks. This feature allows you to add color highlighting for whatever language your code was written in. To add syntax highlighting, specify a language next to the backticks before the fenced code block.

```text
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```//
```

The rendered output looks like this:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## Heading IDs

Many Markdown processors support custom IDs for headings — some Markdown processors automatically add them. Adding custom IDs allows you to link directly to headings and modify them with CSS. To add a custom heading ID, enclose the custom ID in curly braces on the same line as the heading.

```text
### My Great Heading {#custom-id}
```

The HTML looks like this:

```html
<h3 id="custom-id">My Great Heading</h3>
```

## Linking to Heading IDs

You can link to headings with custom IDs in the file by creating a standard link with a number sign (#) followed by the custom heading ID.

| Markdown | HTML | Rendered Output |
| :---- | :---- | :---- |
| \[Heading IDs](#heading-ids) | \<a href="#heading-ids">Heading IDs\</a> | <a href="#heading-ids">Heading IDs</a> |

Other websites can link to the heading by adding the custom heading ID to the full URL of the webpage (e.g, \[Heading IDs](https://www.markdownguide.org/extended-syntax#heading-ids)).

## Definition Lists

Some Markdown processors allow you to create definition lists of terms and their corresponding definitions. To create a definition list, type the term on the first line. On the next line, type a colon followed by a space and the definition.

```text
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
```

The HTML looks like this:

```html
<dl>
  <dt>First Term</dt>
  <dd>This is the definition of the first term.</dd>
  <dt>Second Term</dt>
  <dd>This is one definition of the second term. </dd>
  <dd>This is another definition of the second term.</dd>
</dl>
```

The rendered output looks like this:

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

## Strikethrough

You can “strikethrough” words by putting a horizontal line through the center of them. The result looks like this. This feature allows you to indicate that certain words are a mistake not meant for inclusion in the document. To strikethrough words, use two tilde symbols (~~) before and after the words.

```text
~~The world is flat.~~ We now know that the world is round.
```

The rendered output looks like this:

~~The world is flat.~~ We now know that the world is round.

## Task Lists

Task lists allow you to create a list of items with checkboxes. In Markdown applications that support task lists, checkboxes will be displayed next to the content. To create a task list, add dashes (-) and brackets with a space ([ ]) in front of task list items. To select a checkbox, add an x in between the brackets ([x]).

```text
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```

The rendered output looks like this:

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## Automatic URL Linking

Many Markdown processors automatically turn URLs into links. That means if you type http://www.example.com, your Markdown processor will automatically turn it into a link even though you haven’t used brackets.

```text
http://www.example.com
```

The rendered output looks like this:

http://www.example.com

## Disabling Automatic URL Linking

If you don’t want a URL to be automatically linked, you can remove the link by denoting the URL as code with backticks.

```text
`http://www.example.com`
```

The rendered output looks like this:

`http://www.example.com`
