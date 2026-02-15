#!/bin/bash
# Script para testar a API do servidor Lumena Estética

echo "🧪 Iniciando testes da API..."
echo "=================================="

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Função para fazer teste POST
test_agendamento() {
    echo -e "\n${YELLOW}📝 Teste 1: Criando agendamento válido...${NC}"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/agendamentos" \
        -H "Content-Type: application/json" \
        -d '{
            "nome": "Test User",
            "email": "test@example.com",
            "whatsapp": "11987654321",
            "servico": "Facial",
            "data": "2026-03-20",
            "hora": "14:30",
            "mensagem": "Teste automatizado"
        }')
    
    if echo "$RESPONSE" | grep -q '"sucesso":true'; then
        echo -e "${GREEN}✅ PASSOU: Agendamento criado com sucesso${NC}"
        echo "Resposta: $RESPONSE"
        return 0
    else
        echo -e "${RED}❌ FALHOU: Não foi possível criar agendamento${NC}"
        echo "Resposta: $RESPONSE"
        return 1
    fi
}

# Função para teste de validação
test_validacao_email() {
    echo -e "\n${YELLOW}📝 Teste 2: Validando rejeição de email inválido...${NC}"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/agendamentos" \
        -H "Content-Type: application/json" \
        -d '{
            "nome": "Test User",
            "email": "email-invalido",
            "whatsapp": "11987654321",
            "servico": "Facial",
            "data": "2026-03-20",
            "hora": "14:30",
            "mensagem": ""
        }')
    
    if echo "$RESPONSE" | grep -q '"sucesso":false'; then
        echo -e "${GREEN}✅ PASSOU: Email inválido foi rejeitado${NC}"
        echo "Resposta: $RESPONSE"
        return 0
    else
        echo -e "${RED}❌ FALHOU: Email inválido foi aceito (BUG!)${NC}"
        return 1
    fi
}

# Função para teste de GET
test_listar_agendamentos() {
    echo -e "\n${YELLOW}📝 Teste 3: Listando agendamentos...${NC}"
    
    RESPONSE=$(curl -s "$BASE_URL/api/agendamentos")
    
    if echo "$RESPONSE" | grep -q '\['; then
        echo -e "${GREEN}✅ PASSOU: Lista de agendamentos obtida${NC}"
        echo "Total de agendamentos: $(echo "$RESPONSE" | grep -o '\"id\"' | wc -l)"
        return 0
    else
        echo -e "${RED}❌ FALHOU: Não foi possível obter lista${NC}"
        return 1
    fi
}

# Função para teste de rate limiting
test_rate_limit() {
    echo -e "\n${YELLOW}📝 Teste 4: Testando rate limiting (5 requisições)...${NC}"
    
    for i in {1..5}; do
        curl -s -X POST "$BASE_URL/api/agendamentos" \
            -H "Content-Type: application/json" \
            -d '{
                "nome": "Rate Test",
                "email": "rate'$i'@test.com",
                "whatsapp": "11987654321",
                "servico": "Facial",
                "data": "2026-03-20",
                "hora": "14:30"
            }' > /dev/null
        echo "   Requisição $i/5 enviada"
    done
    
    echo -e "\n   ${YELLOW}Tentando 6ª requisição (deve ser bloqueada)...${NC}"
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/agendamentos" \
        -H "Content-Type: application/json" \
        -d '{
            "nome": "Rate Test",
            "email": "rate6@test.com",
            "whatsapp": "11987654321",
            "servico": "Facial",
            "data": "2026-03-20",
            "hora": "14:30"
        }')
    
    if echo "$RESPONSE" | grep -q '429\|Muitas requisições'; then
        echo -e "${GREEN}✅ PASSOU: Rate limiting está ativo${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  AVISO: Verificar rate limiting manualmente${NC}"
        return 1
    fi
}

# Executar testes
echo "Testando contra: $BASE_URL"
echo ""

PASSED=0
FAILED=0

test_agendamento && ((PASSED++)) || ((FAILED++))
test_validacao_email && ((PASSED++)) || ((FAILED++))
test_listar_agendamentos && ((PASSED++)) || ((FAILED++))
# test_rate_limit && ((PASSED++)) || ((FAILED++))  # Comentado para não bloquear

# Resumo
echo ""
echo "=================================="
echo -e "${GREEN}✅ Testes Aprovados: $PASSED${NC}"
echo -e "${RED}❌ Testes Falhados: $FAILED${NC}"
echo "=================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Alguns testes falharam${NC}"
    exit 1
fi
