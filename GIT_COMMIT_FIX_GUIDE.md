# 🛠️ Guia: Como Resolver Problemas para Enviar seu Commit (git push)

## 🎯 Problema

Você fez alterações no código, criou um commit, mas não consegue enviá-lo para o GitHub. O comando `git push` falha com um erro.

## 🔍 Causa Comum

O repositório local (no seu computador) está **dessincronizado** com o repositório remoto (no GitHub). Isso significa que existem commits no GitHub que você ainda não tem localmente. O Git impede o `push` para evitar a perda acidental de histórico.

## ✅ Solução em 4 Passos

Siga esta sequência no terminal, dentro da pasta do seu projeto.

### Passo 1: Verifique o Status

Veja o estado atual do seu repositório.
```bash
git status
```

### Passo 2: Adicione e Faça o Commit

Garanta que todas as suas alterações estão salvas em um commit. Se você já fez isso, pode pular esta etapa.
```bash
# Adiciona todos os arquivos modificados
git add .

# Cria o commit com uma mensagem clara
git commit -m "feat: Descreve a nova funcionalidade ou correção"
```

### Passo 3: Sincronize com o GitHub (O Passo Mais Importante)

Este comando baixa as atualizações do GitHub e as mescla com suas alterações locais.
```bash
git pull origin main
```

### Passo 4: Envie Suas Alterações

Agora que tudo está sincronizado, o `push` deve funcionar.
```bash
git push origin main
```

---

## 🐛 Solução de Problemas Adicionais

### Erro de Conflito de Merge (Merge Conflict)

Se o `git pull` mostrar uma mensagem de "merge conflict", significa que você e o repositório remoto alteraram a mesma linha em um arquivo.

1.  Abra os arquivos listados no VS Code.
2.  O editor mostrará as seções de conflito claramente marcadas.
3.  Escolha qual versão do código manter (a sua, a remota, ou uma combinação de ambas).
4.  Depois de resolver todos os conflitos, salve os arquivos.
5.  Execute `git add .` e `git commit` novamente.
6.  Tente o `git push` mais uma vez.

### Erro de Autenticação (Authentication Failed)

Se o erro mencionar "authentication failed", "permission denied", ou "403".

1.  **Verifique suas credenciais**: Certifique-se de que está usando um **Personal Access Token (PAT)** em vez da sua senha. O GitHub não aceita mais senhas para operações de linha de comando.
2.  **Gerenciador de Credenciais**: Seu sistema operacional pode ter salvo credenciais antigas. Pode ser necessário limpá-las.

### 🆘 Se Nada Funcionar

Se você continuar recebendo um erro, **copie a mensagem de erro completa** do terminal. Ela contém a chave para diagnosticar e resolver o problema.

---

**Lembrete**: O fluxo de trabalho padrão é sempre `pull` (puxar) antes de `push` (empurrar) para manter seu ambiente de desenvolvimento sincronizado.