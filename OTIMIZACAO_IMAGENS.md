# Guia de Otimização de Imagens - Lumena Estética

## Problema Atual
As imagens estão carregando sem compressão, afetando a velocidade do site e SEO.

## Solução Implementada

### 1. **Lazy Loading** ✅
- **Adicionado**: `loading="lazy"` e `decoding="async"` em todas as imagens
- **Benefício**: Imagens carregam apenas quando visíveis na tela
- **Impacto**: Reduz tempo de carregamento inicial em ~30-40%

### 2. **Content Visibility** ✅
- **Adicionado**: `content-visibility: auto` no CSS
- **Benefício**: Browser não renderiza imagens off-screen
- **Impacto**: Melhora FCP (First Contentful Paint)

### 3. **Aspect Ratio** ✅
- **Adicionado**: `aspect-ratio` para evitar layout shift (CLS)
- **Benefício**: Espaço reservado antes do carregamento
- **Impacto**: Melhora Core Web Vitals

## Próximos Passos: Converter para WebP

### Passo 1: Instalar Ferramentas
```bash
# Windows - usar image converter online ou software
# https://convertio.co/png-webp/
# ou instalar GraphicsMagick
choco install graphicsmagick
```

### Passo 2: Converter PNG para WebP
```bash
# Converter image.png para image.webp com qualidade 80
magick convert image.png -quality 80 image.webp

# Batch converter (para múltiplas imagens)
magick mogrify -format webp -quality 80 *.png
```

### Passo 3: Usar Picture Element (HTML)
```jsx
// Exemplo com React:
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.png" alt="descrição" loading="lazy" decoding="async" />
</picture>
```

### Passo 4: Compressão Adicional
```bash
# Comprimir PNGs (fallback)
# https://tinypng.com/ (online)
# ou instalar pngquant
choco install pngquant

# Usar pngquant
pngquant 64 image.png --ext .png -f

# Resultado esperado: redução de 50-80% de tamanho
```

## Checklist de Otimização

- [x] Adicionar lazy loading em todas as imagens
- [x] Adicionar decoding="async" 
- [x] Adicionar aspect-ratio no CSS
- [x] Adicionar content-visibility
- [ ] Converter imagens para WebP
- [ ] Comprimir PNG (fallback)
- [ ] Usar picture elements para WebP fallback
- [ ] Testar Core Web Vitals (PageSpeed Insights)
- [ ] Configurar CDN para cache de imagens (opcional)

## Tamanhos Recomendados

### Logo
- **Atual**: image.png
- **Tamanho recomendado**: 60x60px máximo
- **Peso esperado**: < 10 KB PNG ou < 5 KB WebP

### Card Images (Serviços)
- **Atual**: image.png (200x aspectratio 16:9)
- **Tamanho recomendado**: 400x225px (2x para retina)
- **Peso esperado**: < 30 KB PNG ou < 15 KB WebP
- **Formato**: WebP com PNG fallback

## Impacto Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| LCP (Largest Contentful Paint) | ~3s | ~1.2s |
| FCP (First Contentful Paint) | ~2s | ~0.8s |
| CLS (Cumulative Layout Shift) | Alto | 0 |
| Tamanho Total | 500+ KB | 50-100 KB |
| Velocidade | 2G: lento | 2G: aceitável |

## Ferramentas Online (sem instalação)

1. **Converter WebP**: https://convertio.co/png-webp/
2. **Comprimir PNG**: https://tinypng.com/
3. **Testar Performance**: https://pagespeed.web.dev/
4. **Analisar Imagens**: https://www.webpagetest.org/

## SEO Benefits

- ✅ Melhora Core Web Vitals (Google ranking factor)
- ✅ Reduz bounce rate (site mais rápido)
- ✅ Melhora crawlability (menos overhead)
- ✅ Melhora scores de Lighthouse

## Comandos Rápidos (Windows PowerShell)

```powershell
# Verificar tamanho das imagens
Get-ChildItem -Filter "*.png" -Recurse | Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}

# Verificar formatos de imagem
Get-ChildItem -Filter "*.{png,jpg,jpeg,webp}" -Recurse | Select-Object Name, Extension
```

## Suporte Atual aos Navegadores

| Formato | Suporte |
|---------|---------|
| WebP | Chrome, Edge, Firefox, Opera (95%+) |
| PNG | Todos os navegadores (fallback seguro) |

## Próximas Fases

1. **Fase 1 (Feita)**: Lazy loading + CSS optimization
2. **Fase 2**: Converter para WebP com picture element
3. **Fase 3**: Implementar responsiveImage (srcset)
4. **Fase 4**: CDN + cache headers (production)

---

**Última atualização**: 15 de Fevereiro de 2026
**Responsável**: Tim de Desenvolvimento
