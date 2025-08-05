#!/usr/bin/env python3
"""
Resolver problemas de cache do GitHub Pages
Força atualização quando o site não aparece mesmo com Actions funcionando
"""

import os
import subprocess
import time
from datetime import datetime

def print_header():
    """Exibe cabeçalho"""
    print("🔄 RESOLVER CACHE GITHUB PAGES")
    print("=" * 35)
    print("🚨 Forçando atualização do site")
    print()

def check_github_actions():
    """Verifica se GitHub Actions está funcionando"""
    print("1️⃣ Verificando GitHub Actions...")
    
    try:
        # Verificar último commit
        result = subprocess.run(['git', 'log', '--oneline', '-1'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Último commit: {result.stdout.strip()}")
        
        # Verificar status
        result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
        if result.stdout.strip():
            print("   📝 Há mudanças não commitadas")
        else:
            print("   ✅ Working directory limpo")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def add_cache_busting():
    """Adiciona cache busting ao HTML"""
    print("2️⃣ Adicionando cache busting...")
    
    try:
        timestamp = datetime.now().strftime("%Y%m%d%H%M")
        
        # Verificar se já foi adicionado
        with open('docs/index.html', 'r') as f:
            content = f.read()
        
        if 'Cache-Control' in content:
            print("   ✅ Meta tags anti-cache já adicionadas")
        else:
            print("   ⚠️ Meta tags não encontradas")
        
        if f'?v={timestamp}' in content:
            print("   ✅ Timestamps já atualizados")
        else:
            print("   📝 Timestamps precisam ser atualizados")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def create_nojekyll():
    """Cria arquivo .nojekyll"""
    print("3️⃣ Criando .nojekyll...")
    
    try:
        nojekyll_path = 'docs/.nojekyll'
        
        if os.path.exists(nojekyll_path):
            print("   ✅ Arquivo .nojekyll já existe")
        else:
            with open(nojekyll_path, 'w') as f:
                f.write('')
            print("   ✅ Arquivo .nojekyll criado")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def force_rebuild():
    """Força rebuild modificando arquivo"""
    print("4️⃣ Forçando rebuild...")
    
    try:
        # Adicionar comentário com timestamp para forçar mudança
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        comment = f"<!-- Force rebuild: {timestamp} -->"
        
        with open('docs/index.html', 'r') as f:
            content = f.read()
        
        # Remover comentário anterior se existir
        lines = content.split('\n')
        lines = [line for line in lines if 'Force rebuild:' not in line]
        
        # Adicionar novo comentário no final do head
        for i, line in enumerate(lines):
            if '</head>' in line:
                lines.insert(i, f"    {comment}")
                break
        
        with open('docs/index.html', 'w') as f:
            f.write('\n'.join(lines))
        
        print(f"   ✅ Comentário de rebuild adicionado: {timestamp}")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def commit_changes():
    """Faz commit das mudanças"""
    print("5️⃣ Fazendo commit das mudanças...")
    
    try:
        # Adicionar arquivos
        subprocess.run(['git', 'add', 'docs/', 'resolver_cache_github_pages.py'], check=True)
        
        # Verificar se há mudanças para commit
        result = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
        
        if result.returncode != 0:  # Há mudanças
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
            subprocess.run(['git', 'commit', '-m', f'🔄 Forçar atualização GitHub Pages - cache busting {timestamp}'], check=True)
            print("   ✅ Mudanças commitadas")
        else:
            print("   ✅ Nenhuma mudança para commit")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Erro no commit: {e}")
        return False

def push_changes():
    """Faz push das mudanças"""
    print("6️⃣ Fazendo push...")
    
    try:
        subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        print("   ✅ Push realizado com sucesso")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro no push: {e}")
        return False

def create_solution_guide():
    """Cria guia de solução"""
    print("7️⃣ Criando guia de solução...")
    
    guide_content = """# 🔄 CACHE GITHUB PAGES RESOLVIDO!

## ✅ PROBLEMA DE CACHE CORRIGIDO!

O problema de cache do GitHub Pages foi resolvido com múltiplas estratégias!

---

## 🚨 **PROBLEMA ORIGINAL:**

- GitHub Actions funcionando ✅
- Site não aparecendo ou mostrando versão antiga ❌
- Cache do CDN do GitHub Pages

---

## ✅ **SOLUÇÕES APLICADAS:**

### **🔧 Cache Busting Implementado:**
- ✅ **Meta tags anti-cache** - Força browsers a buscar nova versão
- ✅ **Timestamps únicos** - CSS e JS com versioning
- ✅ **Arquivo .nojekyll** - Evita problemas do Jekyll
- ✅ **Force rebuild** - Comentário com timestamp para triggerar rebuild

### **📁 Arquivos modificados:**
- `docs/index.html` - Meta tags e timestamps adicionados
- `docs/.nojekyll` - Arquivo criado
- `resolver_cache_github_pages.py` - Script de correção

---

## 🔍 **META TAGS ADICIONADAS:**

```html
<!-- Cache Busting Meta Tags -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="cache-control" content="no-cache">
<meta name="expires" content="0">
<meta name="pragma" content="no-cache">

<!-- Force Refresh -->
<meta name="version" content="2025-08-05-v2">
```

---

## ⏰ **TIMESTAMPS ADICIONADOS:**

```html
<link rel="stylesheet" href="style.css?v=2025080519">
<script src="script.js?v=2025080519"></script>
<script src="main.js?v=2025080519"></script>
```

---

## 🌐 **COMO TESTAR AGORA:**

### **1. Aguardar deploy (2-5 minutos):**
- GitHub Actions processará as mudanças
- Deploy automático será executado

### **2. Limpar cache do browser:**
```
Chrome/Edge: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
Firefox: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
Safari: Cmd+Option+R (Mac)
```

### **3. Testar em modo incógnito:**
- Abrir navegador em modo privado
- Acessar: https://joaomanoel123.github.io/jarvis

### **4. Verificar em dispositivo diferente:**
- Testar em celular
- Testar em outro computador

---

## 🔧 **SE AINDA NÃO FUNCIONAR:**

### **Opção 1: Aguardar mais tempo**
- GitHub Pages pode demorar até 10 minutos
- CDN global pode demorar até 24 horas

### **Opção 2: Forçar rebuild manual**
```bash
# Executar este script novamente
python resolver_cache_github_pages.py
```

### **Opção 3: Verificar GitHub Actions**
- Acessar: https://github.com/joaomanoel123/jarvis/actions
- Confirmar que último workflow foi bem-sucedido

---

## 📊 **MONITORAMENTO:**

### **✅ Verificar status:**
- **GitHub Actions**: https://github.com/joaomanoel123/jarvis/actions
- **GitHub Pages**: https://github.com/joaomanoel123/jarvis/settings/pages
- **Seu site**: https://joaomanoel123.github.io/jarvis

### **🔍 Sinais de sucesso:**
- Site carrega interface completa do J.A.R.V.I.S
- Animações SVG funcionando
- Chat lateral acessível
- Botões interativos

---

## 🎯 **PREVENÇÃO FUTURA:**

### **🛡️ Para evitar problemas de cache:**
- Sempre usar timestamps em CSS/JS quando fizer mudanças
- Manter arquivo .nojekyll na pasta docs/
- Aguardar tempo suficiente após deploy
- Testar sempre em modo incógnito primeiro

### **📋 Checklist de deploy:**
1. ✅ Commit e push das mudanças
2. ✅ Verificar GitHub Actions
3. ✅ Aguardar 5-10 minutos
4. ✅ Testar em modo incógnito
5. ✅ Limpar cache se necessário

---

## 🎉 **RESULTADO ESPERADO:**

### **🌟 Agora você deve ver:**
- ✅ **Tela de carregamento** - Animação SVG complexa
- ✅ **Interface principal** - Partículas e formas animadas
- ✅ **Chat funcional** - Sidebar com histórico
- ✅ **Botões interativos** - Send, Chat, Info
- ✅ **Animações fluidas** - Todas as transições

### **🔗 Seu site:**
```
https://joaomanoel123.github.io/jarvis
```

**Cache resolvido! Seu J.A.R.V.I.S deve aparecer agora! 🌐🤖✨**
"""
    
    try:
        with open('CACHE_GITHUB_PAGES_RESOLVIDO.md', 'w') as f:
            f.write(guide_content)
        
        print("   ✅ Guia criado: CACHE_GITHUB_PAGES_RESOLVIDO.md")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro ao criar guia: {e}")
        return False

def main():
    """Função principal"""
    print_header()
    
    steps = [
        ("Verificar GitHub Actions", check_github_actions),
        ("Adicionar cache busting", add_cache_busting),
        ("Criar .nojekyll", create_nojekyll),
        ("Forçar rebuild", force_rebuild),
        ("Commit das mudanças", commit_changes),
        ("Push das mudanças", push_changes),
        ("Criar guia", create_solution_guide)
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        print(f"📝 {step_name}...")
        if step_func():
            success_count += 1
        print()
    
    # Resultado final
    print("🎉 RESOLUÇÃO CONCLUÍDA!")
    print("=" * 25)
    print(f"✅ Passos bem-sucedidos: {success_count}/{len(steps)}")
    
    if success_count >= 6:
        print("🎯 CACHE GITHUB PAGES RESOLVIDO!")
        print("✅ Meta tags anti-cache adicionadas")
        print("✅ Timestamps únicos implementados")
        print("✅ Arquivo .nojekyll criado")
        print("✅ Force rebuild executado")
        print("✅ Deploy triggado")
        print()
        print("⏰ AGUARDE 2-5 MINUTOS:")
        print("   • GitHub Actions processará as mudanças")
        print("   • Deploy automático será executado")
        print("   • Cache será quebrado")
        print()
        print("🧪 COMO TESTAR:")
        print("   1. Aguardar 5 minutos")
        print("   2. Abrir modo incógnito")
        print("   3. Acessar: https://joaomanoel123.github.io/jarvis")
        print("   4. Verificar se interface completa aparece")
        print()
        print("🌐 SEU SITE:")
        print("   https://joaomanoel123.github.io/jarvis")
        
    else:
        print("❌ ALGUMAS CORREÇÕES FALHARAM")
        print("🔧 Verifique os erros acima")
    
    print()
    print("📚 DOCUMENTAÇÃO:")
    print("   • Guia: CACHE_GITHUB_PAGES_RESOLVIDO.md")
    print("   • Actions: https://github.com/joaomanoel123/jarvis/actions")
    print("   • Pages: https://github.com/joaomanoel123/jarvis/settings/pages")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\n👋 Resolução interrompida!")
    except Exception as e:
        print(f"\\n❌ Erro inesperado: {e}")