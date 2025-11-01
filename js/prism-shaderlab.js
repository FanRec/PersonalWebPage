(function (Prism) {
  // 基础：从 C-like 语言继承
  Prism.languages.shaderlab = Prism.languages.extend("clike", {
    keyword:
      /\b(?:Shader|Properties|SubShader|Pass|Tags|LOD|Fallback|GrabPass|Cull|ZTest|ZWrite|Blend|BlendOp|ColorMask|Stencil|Offset|CGPROGRAM|CGINCLUDE|ENDCG|HLSLPROGRAM|HLSLINCLUDE|ENDHLSL)\b/i,
  });

  // 1. ShaderLab 属性 (Property) 定义
  Prism.languages.insertBefore("shaderlab", "keyword", {
    "shaderlab-property": {
      // 示例: _MainTex ("Texture", 2D) = "white" {}
      // 匹配 "Texture", 2D, Color, Vector, Float, Range, Int 等类型
      pattern:
        /(\"[^\"]+\")\s*\(\s*(?:2D|3D|Cube|Color|Vector|Float|Range|Int)\s*\)\s*=\s*.*?(?={|$)/i,
      lookbehind: true,
      inside: {
        "property-type": /\b(?:2D|3D|Cube|Color|Vector|Float|Range|Int)\b/i,
        string: /\"[^\"]+\"/,
        punctuation: /[()=,]/,
      },
    },
  });

  // 2. 嵌入式 HLSL/Cg 块高亮 (最重要)
  // 注意：你需要确保已经加载了 'clike' 或 'markup' 语言组件。
  // 如果你还需要 HLSL 独有的函数高亮，可能需要自己添加 'hlsl' 语言定义。

  // 匹配 CGPROGRAM...ENDCG 和 HLSLPROGRAM...ENDHLSL
  Prism.languages.insertBefore("shaderlab", "string", {
    "embedded-code": {
      // 这会捕获整个块，包括 CGPROGRAM 和 ENDCG 关键字
      pattern:
        /(\b(?:CGPROGRAM|CGINCLUDE|HLSLPROGRAM|HLSLINCLUDE)\b[\s\S]*?\b(?:ENDCG|ENDHLSL)\b)/i,
      lookbehind: true,
      inside: {
        "language-identifier":
          /\b(?:CGPROGRAM|CGINCLUDE|HLSLPROGRAM|HLSLINCLUDE|ENDCG|ENDHLSL)\b/i,
        // 将块内的其他代码视为 C-like 语言进行高亮
        rest: Prism.languages.clike,
      },
    },
  });

  // 3. 常见 ShaderLab 宏/函数
  Prism.languages.insertBefore("shaderlab", "function", {
    "shaderlab-function":
      /\b(?:SetTexture|SetMatrix|Color|Material|Fog)\b(?=\s*\()/i,
  });
})(Prism);
