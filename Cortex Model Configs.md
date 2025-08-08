# 🧠 Cortex Model Configurations for BotBridge

This repository contains the configuration definitions for all models used in the **BotBridge** project at Lilly. Each configuration includes metadata, ownership, chains, prompts, versioning, toolkits, and other advanced parameters.

---

## 🧭 Supervisor Bot

Selects the best expert agent for a query and rigorously evaluates responses.

```jsonc
{
  "name": "supervisor-bot",
  "displayName": "supervisor-bot",
  "model_description": "A supervisor agent that selects the best domain expert agent for a user query and evaluates the response.",
  "auth": {
    "owners": [
      "akhil.malhotra@lilly.com",
      "arushi.gupta@lilly.com",
      "daniella.melero@lilly.com"
    ],
    "private": false
  },
  "chain": [
    {
      "chain_class": "agent-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {
        "max_turns": 10,
        "execution_type": "handoff",
        "supervisor": {
          "prompt": "You are an EXTREMELY STRICT supervisor agent... [full prompt omitted for brevity]",
          "description": "You analyze queries, assign expert agents, and evaluate outputs."
        },
        "childtoparenthandoff": "ALWAYS GIVE THE RESPONSE BACK TO THE SUPERVISOR ALWAYS",
        "resources": {
          "executables": [
            { "type": "model", "name": "medbot", "description": "Lilly medicines expert" },
            { "type": "model", "name": "complianceebot", "description": "Compliance guidance expert" },
            { "type": "model", "name": "travellerbot", "description": "Indiana travel expert" },
            { "type": "model", "name": "regulationsbot", "description": "Policy and news via web search" }
          ]
        }
      }
    }
  ],
  "model_versions": [
    { "model_class": "lilly-openai", "model_iteration": 18, "priority": 100 }
  ],
  "prompts": {
    "no_context": "default_no_context",
    "with_context": "default_with_context",
    "with_json_context": "default_with_json_context"
  },
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 3,
  "max_response_token_size": 4096,
  "app_binding": "chatbuilder",
  "token_buffer_size": 1.2,
  "temperature": 0.7,
  "top_p": 1
}
```

---

## 💊 MedBot

Handles queries related to Lilly medicines, including side effects and ingredients.

```jsonc
{
  "name": "medbot",
  "displayName": "MedBot",
  "model_description": "Helps users identify potential causes of side effects and suggests next steps based on Lilly medicine knowledge.",
  "auth": {
    "owners": ["akhil.malhotra@lilly.com", "daniella.melero@lilly.com", "arushi.gupta@lilly.com"],
    "owners_aws_roles": ["arn:aws:iam::283234040926:role/lrl-light-apps-chatbuilder-prd-ciab"],
    "private": false
  },
  "chain": [
    {
      "chain_class": "doc-chain",
      "model_iteration": 1,
      "order": 1
    }
  ],
  "model_versions": [
    { "model_class": "lilly-openai", "model_iteration": 18, "priority": 100 }
  ],
  "prompts": {
    "no_context": "ciab_default_no_context",
    "with_json_context": "medbot_with_json_context"
  },
  "data": ["medbot"],
  "multimodal": true,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 7,
  "temperature": 0
}

```

---

## 🌍 TravellerBot

Recommends places to visit in Indiana, based on user preferences.

```jsonc
{
  "name": "travellerbot",
  "displayName": "travellerbot",
  "model_description": "For people to find places to visit in Indiana.",
  "auth": {
    "owners": ["andrew.allen2@lilly.com", "arushi.gupta@lilly.com", "daniella.melero@lilly.com"],
    "private": false
  },
  "chain": [
    {
      "chain_class": "tool-chain",
      "model_iteration": 1,
      "order": 1
    }
  ],
  "model_versions": [
    { "model_class": "lilly-openai", "model_iteration": 18, "priority": 100 }
  ],
  "toolkits": ["cortex-web-search-dev"],
  "allowed_tools_list": ["WebSearch"],
  "prompts": {
    "no_context": "travelprompt"
  },
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "temperature": 0
}

```

---

## 🛡️ ComplianceBot

Answers questions related to internal compliance rules and best practices.

```jsonc
{
  "name": "complianceebot",
  "displayName": "ComplianceBot",
  "model_description": "Helps with queries related to Lilly compliance guidance and employee rules.",
  "auth": {
    "owners": ["daniella.melero@lilly.com", "akhil.malhotra@lilly.com", "arushi.gupta@lilly.com"],
    "private": false
  },
  "chain": [
    {
      "chain_class": "doc-chain",
      "model_iteration": 1,
      "order": 1
    }
  ],
  "model_versions": [
    { "model_class": "lilly-openai", "model_iteration": 18, "priority": 100 }
  ],
  "prompts": {
    "no_context": "ciab_default_no_context",
    "with_json_context": "medbot_with_json_context"
  },
  "data": ["complianceebot"],
  "multimodal": true,
  "agent_tool_max_iterations": 7,
  "temperature": 0
}

```

---

## 📰 RegulationsBot

Monitors news, policies, trials, and regulations using web tools.

```jsonc
{
  "name": "regulationsbot",
  "displayName": "regulations bot",
  "model_description": "Smart assistant for tracking regulatory and news updates using web scraping/search.",
  "auth": {
    "owners": ["daniella.melero@lilly.com", "akhil.malhotra@lilly.com", "arushi.gupta@lilly.com"],
    "private": false
  },
  "chain": [
    {
      "chain_class": "tool-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {
        "tools": [
          { "name": "cortex-web-search-dev", "order": 1 }
        ]
      }
    }
  ],
  "model_versions": [
    { "model_class": "lilly-openai", "model_iteration": 18, "priority": 100 }
  ],
  "toolkits": ["cortex-web-search-dev", "cortex-web-scraper-dev"],
  "allowed_tools_list": ["WebSearch", "Web Scraper"],
  "max_response_token_size": 4096,
  "agent_tool_max_iterations": 10,
  "temperature": 0.7,
  "stop": ["string"]
}

```

---

## 🔖 Common Configuration Notes

- **Model Class:** All models use `lilly-openai` with iteration 18
- **Hybrid Search:** Enabled with consistent weights and thresholds across bots
- **Security & Auth:** All bots are public (`"private": false`) but have clearly defined owners
- **Application Binding:** All bound to `chatbuilder`
- **Reranking Model:** Configured but disabled across all models
