# 🔧 GitHub Pages - Troubleshooting

## Problema: Erro de Output no GitHub Pages

### Sintomas
- Site não carrega ou mostra página em branco
- Erro 404 ou 500 no GitHub Pages
- Workflow do GitHub Actions falha
- Deploy aparece como bem-sucedido mas site não funciona

### Soluções Implementadas

#### 1. ✅ Workflow Atualizado
- Atualizado `.github/workflows/pages.yml`
- Removido configurações desnecessárias
- Atualizado versões das actions

#### 2. ✅ Cache Buster Adicionado
- Arquivo `docs/cache-buster.txt` para forçar atualização
- Timestamp automático no deploy

#### 3. ✅ Script de Deploy Corrigido
- Novo script: `deploy-github-pages-fix.sh`
- Verificações automáticas
- Melhor tratamento de erros

### Como Usar

#### Opção 1: Script Automático (Recomendado)
```bash
./deploy-github-pages-fix.sh
```

#### Opção 2: Manual
```bash
# 1. Atualizar cache buster
echo "$(date)" > docs/cache-buster.txt

# 2. Commit e push
git add .
git commit -m "🚀 Deploy GitHub Pages - $(date)"
git push origin main
```

### Verificações Pós-Deploy

1. **GitHub Actions**
   - Acesse: https://github.com/joaomanoel123/jarvis/actions
   - Verifique se o workflow executou sem erros
   - Tempo estimado: 2-5 minutos

2. **GitHub Pages Settings**
   - Acesse: https://github.com/joaomanoel123/jarvis/settings/pages
   - Confirme: Source = "GitHub Actions"
   - ✅ Deve mostrar: "Your site is published at..."

3. **Site Final**
   - URL: https://joaomanoel123.github.io/jarvis
   - Aguarde 5-10 minutos após deploy bem-sucedido
   - Teste em modo incógnito para evitar cache

### Problemas Comuns e Soluções

#### ❌ Workflow Falha
**Causa**: Permissões ou configuração incorreta
**Solução**: 
1. Vá em Settings > Actions > General
2. Workflow permissions: "Read and write permissions"
3. Allow GitHub Actions to create and approve pull requests: ✅

#### ❌ Site Mostra 404
**Causa**: Configuração incorreta do GitHub Pages
**Solução**:
1. Settings > Pages
2. Source: "GitHub Actions" (não "Deploy from branch")
3. Aguarde novo deploy

#### ❌ Site Carrega Mas Não Funciona
**Causa**: Problemas de JavaScript ou recursos
**Solução**:
1. Abra DevTools (F12)
2. Verifique Console para erros
3. Verifique Network para recursos não carregados
4. Teste em modo incógnito

#### ❌ Deploy Bem-sucedido Mas Site Não Atualiza
**Causa**: Cache do navegador ou CDN
**Solução**:
1. Ctrl+F5 (hard refresh)
2. Modo incógnito
3. Aguarde 10-15 minutos
4. Verifique se cache-buster.txt foi atualizado

### Logs Úteis

#### GitHub Actions Logs
```
https://github.com/joaomanoel123/jarvis/actions
```

#### Browser DevTools
```javascript
// Console do navegador
console.log('Jarvis carregado:', window.eel);
console.log('Cache buster:', new Date());
```

### Contato e Suporte

Se o problema persistir:
1. Verifique os logs do GitHub Actions
2. Compare com repositórios similares funcionando
3. Teste localmente primeiro
4. Considere usar GitHub Pages com branch ao invés de Actions

---

**Última atualização**: 2025-08-10
**Status**: ✅ Soluções implementadas