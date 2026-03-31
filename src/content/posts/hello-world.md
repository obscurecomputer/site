---
title: "test"
date: 2026-02-25
description: "abc test post"
tags: ["meta", "announcements"]
author: "the obscure computer club"
---

This is text

This is _underlined_ text

This is **bold** text

This is ~~striked~~ text

This is a quote
> The best way to predict the future is to invent it<br />
> \- Alan Kay

## Heading 2

### Heading 3

#### Heading 4

- List item
  - List item 2

1. Numbered item
2. Numbered item 2


| Header 1     | Header 2     | Header 3     |
|--------------|--------------|--------------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |

:::important
do NOT turn on the blender after 4pm
:::

```kt
class MyNative : TwineNative("mylib") {
    @TwineNativeFunction
    @TwineOverload  // <- Mark both with this
    fun doThing(text: String): String {
        return "Got string: $text"
    }

    @TwineNativeFunction
    @TwineOverload  // <- Same annotation
    fun doThing(number: Int): Int {
        return number * 2
    }
}
```