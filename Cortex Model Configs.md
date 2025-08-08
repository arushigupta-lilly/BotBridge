# 🧠 Cortex Model Configurations for BotBridge

This repository contains the configuration definitions for all models used in the **BotBridge** project at Lilly. Each configuration includes metadata, ownership, chains, prompts, versioning, toolkits, and other advanced parameters.

---

## 🧭 Supervisor Bot

Selects the best expert agent for a query and rigorously evaluates responses.

```jsonc
{
  "name": "supervisor-bot",
  "auth": {
    "owners": [
      "akhil.malhotra@lilly.com",
      "arushi.gupta@lilly.com",
      "daniella.melero@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [],
    "users": [],
    "private": false
  },
  "displayName": "supervisor-bot",
  "model_description": "A supervisor agent that selects the best domain expert agent for a user query and evaluates the response.",
  "security_config": "",
  "chain": [
    {
      "chain_class": "agent-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {
        "max_turns": 10,
        "execution_type": "handoff",
        "supervisor": {
          "prompt": "You are an EXTREMELY STRICT supervisor agent. Your job is to:\n\n1. Understand the user query completely\n2. Choose the ONE most relevant specialized agent to answer it\n3. Return the agent's response to the user\n4. Then conduct RIGOROUS evaluation using harsh scoring criteria\n5. Rank all 4 agents by relevance to the query\n\nMANDATORY FORMAT:\n\n[Agent_Name]\n<response>\n\nAccuracy: <score>\n<explanation>\n\nCompleteness: <score>\n<explanation>\n\nRelevancy Ranking (1 = most relevant):\n1. Agent_Name: (reason)\n2. Agent_Name: (reason)\n3. Agent_Name: (reason)\n4. Agent_Name: (reason)\n\nCitations (if applicable):\n[1] source.pdf [2] https://www.cms.gov/\n\nSCORING CRITERIA:\n\nACCURACY (0.0-1.0):\n- 1.0: Perfect, no errors (EXTREMELY RARE)\n- 0.8-0.90: Mostly accurate\n- 0.6: Partially accurate, notable errors\n- 0.4: More wrong than right\n- 0.2: Largely incorrect\n- 0.0: Completely wrong\n\nCOMPLETENESS (0.0-1.0):\n- 1.0: Answers ALL aspects comprehensively (EXTREMELY RARE)\n- 0.8-0.9: Covers most aspects, minor omissions\n- 0.6: Addresses core, misses several aspects\n- 0.4: Incomplete, misses more than covers\n- 0.2: Barely addresses question\n- 0.0: Does not answer question\n\nPENALTY CONDITIONS:\n- Deduct 0.2-0.4 for unverifiable information\n- Deduct 0.2-0.4 for insufficient detail\n- Heavily penalize oversimplified answers\n- Speculation as fact reduces accuracy significantly\n- Missing critical safety info (medical queries) heavily penalizes completeness\nCRITICAL: Be ruthlessly strict. Most responses should score 0.4-0.7. Perfect 1.0 scores should be virtually non-existent - only for absolutely flawless, comprehensive responses.",
          "description": "You are a supervisor agent that analyzes queries, selects the most appropriate expert agent, and returns consistently formatted, evaluated responses."
        },
        "childtoparenthandoff": "ALWAYS GIVE THE RESPONSE BACK TO THE SUPERVISOR ALWAYS",
        "resources": {
          "executables": [
            {
              "type": "model",
              "name": "medbot",
              "description": "You are an expert of Lilly medicines. Your task is to answer any questions related to lilly medicines, prescribing information, and side effects"
            },
            {
              "type": "model",
              "name": "complianceebot",
              "description": "You are an expert of Lilly compliance. Your task is to answer any user queries regarding Field Medical and Commercial Guidance, Employee Guidelines, and appropriate & inappropriate interactions with medical and commercial."
            },
            {
              "type": "model",
              "name": "travellerbot",
              "description": "You are a travel expert of Indiana. Your task is to understand what kind of places the user likes to visit, their likes and dislikes, and the kind of places they want to visit (museums, parks, cafes, etc.). If the query is vague, ALWAYS assume the location they are searching is in Indianapolis, Indiana."
            },
            {
              "type": "model",
              "name": "regulationsbot",
              "description": "You are a specialized agent to answer questions regarding trials, competitors, news, government policy updates and more using your web search and web scraping tools."
            }
          ]
        }
      }
    }
  ],
  "model_versions": [
    {
      "model_class": "lilly-openai",
      "model_iteration": 18,
      "priority": 100,
      "reasoning_effort": null,
      "enable_thinking": false,
      "advanced_param_overrides": {}
    }
  ],
  "prompts": {
    "no_context": "default_no_context",
    "with_context": "default_with_context",
    "with_json_context": "default_with_json_context",
    "enhance_query": "default_enhance_query",
    "sql": "default_sql",
    "agent_tool": "default_agent_tool",
    "cortex_agent_tool_prompt_v2": "default_cortex_agent_tool_prompt_v2",
    "table_summary": "default_table_summary",
    "summary": "default_summary",
    "entity_extraction": "default_entity_extraction",
    "rewrite": "default_rewrite",
    "kg_triple_extraction": "default_kg_triple_extraction"
  },
  "toolkits": [],
  "allowed_tools_list": [],
  "data": [],
  "max_response_token_size": 4096,
  "doc_relevence_threshold": 0.5,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 3,
  "app_binding": "chatbuilder",
  "multimodal": false,
  "labels": {},
  "k_value": 20,
  "token_buffer_size": 1.2,
  "temperature": 0.7,
  "top_p": 1,
  "stop": [],
  "seed": 0,
  "logprobs": false,
  "rerank": {
    "enabled": false,
    "model": "cohere-rerank-3.5",
    "top_n": 20
  },
  "context_cache_key": ""
}
```

---

## 💊 MedBot

Handles queries related to Lilly medicines, including side effects and ingredients.

```jsonc
{
  "name": "medbot",
  "auth": {
    "owners": [
      "akhil.malhotra@lilly.com",
      "daniella.melero@lilly.com",
      "arushi.gupta@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [
      "arn:aws:iam::283234040926:role/lrl-light-apps-chatbuilder-prd-ciab"
    ],
    "users": [],
    "private": false
  },
  "displayName": "MedBot",
  "model_description": "<p>Given information about a patient's experience/side effects with a Lilly medicine, given what you know about the medicine and its side effects, help them figure out what ingredients could be causing the issue and next steps on fixing the issue.</p>",
  "security_config": null,
  "chain": [
    {
      "chain_class": "doc-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {}
    }
  ],
  "model_versions": [
    {
      "model_class": "lilly-openai",
      "model_iteration": 18,
      "priority": 100,
      "reasoning_effort": null,
      "enable_thinking": false,
      "advanced_param_overrides": {}
    }
  ],
  "prompts": {
    "no_context": "ciab_default_no_context",
    "with_context": "ciab_default_with_context",
    "with_json_context": "medbot_with_json_context",
    "enhance_query": "default_enhance_query",
    "sql": "default_sql",
    "agent_tool": "default_agent_tool",
    "cortex_agent_tool_prompt_v2": "default_cortex_agent_tool_prompt_v2",
    "table_summary": "default_table_summary",
    "summary": "default_summary",
    "entity_extraction": "default_entity_extraction",
    "rewrite": "default_rewrite",
    "kg_triple_extraction": "default_kg_triple_extraction"
  },
  "toolkits": [],
  "allowed_tools_list": null,
  "data": [
    "medbot"
  ],
  "max_response_token_size": 0,
  "doc_relevence_threshold": 0.5,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 7,
  "app_binding": "chatbuilder",
  "multimodal": true,
  "labels": {},
  "k_value": 20,
  "token_buffer_size": 1.2,
  "temperature": 0,
  "top_p": 1,
  "stop": null,
  "seed": null,
  "logprobs": false,
  "rerank": {
    "enabled": false,
    "model": "cohere-rerank-3.5",
    "top_n": 20
  },
  "context_cache_key": ""
}

```
## Medbot Data configuration (storing documents about Lilly Prescribing Information, Drug Labels, etc.)

```
{
  "name": "medbot",
  "auth": {
    "owners": [
      "daniella.melero@lilly.com",
      "arushi.gupta@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [
      "arn:aws:iam::283234040926:role/lrl-light-apps-chatbuilder-prd-ciab"
    ],
    "users": [],
    "private": false
  },
  "s3_bucket": "lly-light-prod",
  "s3_prefix": "llm-prd",
  "exclude_filter": [],
  "assume_role": "",
  "displayName": "MedBot",
  "data_config_description": "<p>Given information about a patient's experience/side effects with a Lilly medicine, given what you know about the medicine and its side effects, help them figure out what ingredients could be causing the issue and next steps on fixing the issue.</p>",
  "embedding": {
    "model": "text-embedding-3-large",
    "open_api_type": "azure"
  },
  "model_version": {
    "model_class": "lilly-openai",
    "model_iteration": "7"
  },
  "vectorstore": "pinecone",
  "concepts_of_interest": null,
  "augmentable_metadata": null,
  "allowed_model_configs": [
    "medbot"
  ],
  "chunk_size": 1500,
  "chunk_overlap": 300,
  "index_name": "e311c5976ef10ea104309faec2631f08",
  "contextual_chunking": {
    "is_enable": false,
    "separator": [
      "\n\n",
      "\n",
      ".",
      " "
    ],
    "chunk_size": 1500,
    "chunk_overlap": 300,
    "depth": 3
  },
  "multimodal": true,
  "bounding_boxes": false,
  "snd_config": null
}
```

---

## 🌍 TravellerBot

Recommends places to visit in Indiana, based on user preferences.

```jsonc
{
  "name": "travellerbot",
  "auth": {
    "owners": [
      "andrew.allen2@lilly.com",
      "arushi.gupta@lilly.com",
      "daniella.melero@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [],
    "users": [],
    "private": false
  },
  "displayName": "travellerbot",
  "model_description": "For people to find places to visit in indiana",
  "security_config": "travellerbot",
  "chain": [
    {
      "chain_class": "tool-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {}
    }
  ],
  "model_versions": [
    {
      "model_class": "lilly-openai",
      "model_iteration": 18,
      "priority": 100,
      "reasoning_effort": null,
      "enable_thinking": false,
      "advanced_param_overrides": {}
    }
  ],
  "prompts": {
    "no_context": "travelprompt",
    "with_context": "default_with_context",
    "with_json_context": "default_with_json_context",
    "enhance_query": "default_enhance_query",
    "sql": "default_sql",
    "agent_tool": "default_agent_tool",
    "cortex_agent_tool_prompt_v2": "default_cortex_agent_tool_prompt_v2",
    "table_summary": "default_table_summary",
    "summary": "default_summary",
    "entity_extraction": "default_entity_extraction",
    "rewrite": "default_rewrite",
    "kg_triple_extraction": "default_kg_triple_extraction"
  },
  "toolkits": [
    "cortex-web-search-dev"
  ],
  "allowed_tools_list": [
    "WebSearch"
  ],
  "data": [],
  "max_response_token_size": 0,
  "doc_relevence_threshold": 0.5,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 0,
  "app_binding": "chatbuilder",
  "multimodal": false,
  "labels": {},
  "k_value": 20,
  "token_buffer_size": 1.2,
  "temperature": 0,
  "top_p": 1,
  "stop": null,
  "seed": null,
  "logprobs": false,
  "rerank": {
    "enabled": false,
    "model": "cohere-rerank-3.5",
    "top_n": 20
  },
  "context_cache_key": ""
}

```

---

## 🛡️ ComplianceBot

Answers questions related to internal compliance rules and best practices.

```jsonc
{
  "name": "complianceebot",
  "auth": {
    "owners": [
      "daniella.melero@lilly.com",
      "akhil.malhotra@lilly.com",
      "arushi.gupta@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [],
    "users": [],
    "private": false
  },
  "displayName": "ComplianceBot",
  "model_description": "Given information about problems or questions about compliance rules, it uses its knowledge base to help with any queries regarding compliance.",
  "security_config": null,
  "chain": [
    {
      "chain_class": "doc-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {}
    }
  ],
  "model_versions": [
    {
      "model_class": "lilly-openai",
      "model_iteration": 18,
      "priority": 100,
      "reasoning_effort": null,
      "enable_thinking": false,
      "advanced_param_overrides": {}
    }
  ],
  "prompts": {
    "no_context": "ciab_default_no_context",
    "with_context": "ciab_default_with_context",
    "with_json_context": "medbot_with_json_context",
    "enhance_query": "default_enhance_query",
    "sql": "default_sql",
    "agent_tool": "default_agent_tool",
    "cortex_agent_tool_prompt_v2": "default_cortex_agent_tool_prompt_v2",
    "table_summary": "default_table_summary",
    "summary": "default_summary",
    "entity_extraction": "default_entity_extraction",
    "rewrite": "default_rewrite",
    "kg_triple_extraction": "default_kg_triple_extraction"
  },
  "toolkits": [],
  "allowed_tools_list": null,
  "data": [
    "complianceebot"
  ],
  "max_response_token_size": 0,
  "doc_relevence_threshold": 0.5,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 7,
  "app_binding": "chatbuilder",
  "multimodal": true,
  "labels": {},
  "k_value": 20,
  "token_buffer_size": 1.2,
  "temperature": 0,
  "top_p": 1,
  "stop": null,
  "seed": null,
  "logprobs": false,
  "rerank": {
    "enabled": false,
    "model": "cohere-rerank-3.5",
    "top_n": 20
  },
  "context_cache_key": ""
}

```
```
{
  "name": "complianceebot",
  "auth": {
    "owners": [
      "daniella.melero@lilly.com",
      "akhil.malhotra@lilly.com",
      "arushi.gupta@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [
      "arn:aws:iam::283234040926:role/lrl-light-apps-chatbuilder-prd-ciab"
    ],
    "users": [],
    "private": false
  },
  "s3_bucket": "lly-light-prod",
  "s3_prefix": "llm-prd",
  "exclude_filter": [],
  "assume_role": "",
  "displayName": "ComplianceBot",
  "data_config_description": "Given information about problems or questions about compliance rules, it uses its knowledge base to help with any queries regarding compliance.",
  "embedding": {
    "model": "text-embedding-3-large",
    "open_api_type": "azure"
  },
  "model_version": {
    "model_class": "claude",
    "model_iteration": "13"
  },
  "vectorstore": "pinecone",
  "concepts_of_interest": null,
  "augmentable_metadata": null,
  "allowed_model_configs": [
    "complianceebot"
  ],
  "chunk_size": 1500,
  "chunk_overlap": 300,
  "index_name": "696139917848e9e3730fe74bf338e5c0",
  "contextual_chunking": {
    "is_enable": false,
    "separator": [
      "\n\n",
      "\n",
      ".",
      " "
    ],
    "chunk_size": 1500,
    "chunk_overlap": 300,
    "depth": 3
  },
  "multimodal": true,
  "bounding_boxes": false,
  "snd_config": null
}

```

---

## 📰 RegulationsBot
# Note: We refer to this one as "WebSearch&Scrape Bot"

Monitors news, policies, trials, and regulations using web tools.

```jsonc
{
  "name": "regulationsbot",
  "auth": {
    "owners": [
      "daniella.melero@lilly.com",
      "akhil.malhotra@lilly.com",
      "arushi.gupta@lilly.com"
    ],
    "allow_access_to_reports_of": [],
    "owners_group": [],
    "access_groups": [],
    "access_aws_roles": [],
    "owners_aws_roles": [],
    "users": [],
    "private": false
  },
  "displayName": "regulations bot",
  "model_description": "A smart assistant for using web scraping to check updates on government regulations and other websites.",
  "security_config": "",
  "chain": [
    {
      "chain_class": "tool-chain",
      "model_iteration": 1,
      "order": 1,
      "chain_params": {
        "tools": [
          {
            "name": "cortex-web-search-dev",
            "order": 1
          }
        ]
      }
    }
  ],
  "model_versions": [
    {
      "model_class": "lilly-openai",
      "model_iteration": 18,
      "priority": 100,
      "reasoning_effort": null,
      "enable_thinking": false,
      "advanced_param_overrides": {}
    }
  ],
  "prompts": {
    "no_context": "default_no_context",
    "with_context": "default_with_context",
    "with_json_context": "default_with_json_context",
    "enhance_query": "default_enhance_query",
    "sql": "default_sql",
    "agent_tool": "default_agent_tool",
    "cortex_agent_tool_prompt_v2": "default_cortex_agent_tool_prompt_v2",
    "table_summary": "default_table_summary",
    "summary": "default_summary",
    "entity_extraction": "default_entity_extraction",
    "rewrite": "default_rewrite",
    "kg_triple_extraction": "default_kg_triple_extraction"
  },
  "toolkits": [
    "cortex-web-search-dev",
    "cortex-web-scraper-dev"
  ],
  "allowed_tools_list": [
    "WebSearch",
    "Web Scraper"
  ],
  "data": [],
  "max_response_token_size": 4096,
  "doc_relevence_threshold": 0.5,
  "hybrid_search": {
    "rrf_relevance_threshold": 0.012,
    "rrf_constant": 60,
    "hybrid_score_type": "average",
    "lexical_average_weight": 50
  },
  "agent_tool_max_iterations": 10,
  "app_binding": "chatbuilder",
  "multimodal": false,
  "labels": {},
  "k_value": 20,
  "token_buffer_size": 1.2,
  "temperature": 0.7,
  "top_p": 1,
  "stop": [
    "string"
  ],
  "seed": 0,
  "logprobs": false,
  "rerank": {
    "enabled": false,
    "model": "cohere-rerank-3.5",
    "top_n": 20
  },
  "context_cache_key": ""
}
```

---

## 🔖 Common Configuration Notes

- **Model Class:** All models use `lilly-openai` with iteration 18
- **Hybrid Search:** Enabled with consistent weights and thresholds across bots
- **Security & Auth:** All bots are public (`"private": false`) but have clearly defined owners
- **Application Binding:** All bound to `chatbuilder`
- **Reranking Model:** Configured but disabled across all models
