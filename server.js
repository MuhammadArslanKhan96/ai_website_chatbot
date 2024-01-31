const express = require("express");
const bodyParser = require("body-parser");
// const axios = require('axios');
const { Wit } = require("node-wit");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "./.env",
  });
}

const app = express();
const PORT = process.env.PORT || 8080;

const { WIT_AI_ACCESS_TOKEN, BRIAN_API_KEY } = process.env;
// const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const _0x520456 = _0xd006;
function _0xd006(_0x274aff, _0x1eba18) {
  const _0x334d63 = _0x334d();
  return (
    (_0xd006 = function (_0xd00664, _0x3ae3e7) {
      _0xd00664 = _0xd00664 - 0x188;
      let _0x8dc87c = _0x334d63[_0xd00664];
      return _0x8dc87c;
    }),
    _0xd006(_0x274aff, _0x1eba18)
  );
}
function _0x334d() {
  const _0x491235 = [
    "8AtnUnX",
    "5238920EzFYCY",
    "40vYkPNj",
    "482736CHaLoU",
    "3780171jYTYNc",
    "2Gcxaba",
    "2946372xjTnhY",
    "7nTtQnN",
    "5788684SlxFIi",
    "139242xZRycq",
    "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",
    "2894205GKTIki",
  ];
  _0x334d = function () {
    return _0x491235;
  };
  return _0x334d();
}
(function (_0x1b64c2, _0x303be2) {
  const _0x2fa031 = _0xd006,
    _0x26a623 = _0x1b64c2();
  while (!![]) {
    try {
      const _0x3f7181 =
        (-parseInt(_0x2fa031(0x18f)) / 0x1) *
          (-parseInt(_0x2fa031(0x191)) / 0x2) +
        (-parseInt(_0x2fa031(0x189)) / 0x3) *
          (-parseInt(_0x2fa031(0x18e)) / 0x4) +
        parseInt(_0x2fa031(0x18b)) / 0x5 +
        (parseInt(_0x2fa031(0x192)) / 0x6) *
          (-parseInt(_0x2fa031(0x193)) / 0x7) +
        (parseInt(_0x2fa031(0x18c)) / 0x8) *
          (parseInt(_0x2fa031(0x190)) / 0x9) +
        -parseInt(_0x2fa031(0x18d)) / 0xa +
        -parseInt(_0x2fa031(0x188)) / 0xb;
      if (_0x3f7181 === _0x303be2) break;
      else _0x26a623["push"](_0x26a623["shift"]());
    } catch (_0x23cda1) {
      _0x26a623["push"](_0x26a623["shift"]());
    }
  }
})(_0x334d, 0x62c3a);
const OPENAI_API_KEY = _0x520456(0x18a);

const options = {
  headers: {
    "Content-Type": "application/json",
    "x-access-token":
      "coinrankingcd08ef7085d8b32d22bba47c76cf0d735abccaa1ad9e3434",
  },
};

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const fetchCoinDetails = async (payload) => {
  try {
    const data = await fetch(
      `https://api.coinranking.com/v2/coins/?${payload}`,
      options
    ).then((response) => response.json());

    if (!data?.status) {
      return null;
    }

    return data?.data;
  } catch (error) {
    console.error(`Error fetching coin price: ${error.message}`);
    return null;
  }
};

const getSingleCoin = async (coins) => {
  const coin = coins[0].body;
  const coinsDetails = await fetchCoinDetails(`search=${coin}`);
  if (coinsDetails?.coins[0]) {
    return `The current price of ${coin} is ${coinsDetails?.coins[0].price} USD.`;
  }
};

const getExChangeRate = async (coins, currency) => {
  const coin_1 = coins[0].body;
  const coin_2 = currency ? currency[0].body : coins[1].body;
  const coin_2_details = await fetchCoinDetails(`search=${coin_2}`);

  const coin_2_id = coin_2_details?.coins[0].uuid || "";
  const coinsDetails = await fetchCoinDetails(
    `search=${coin_1}&referenceCurrencyUuid=${coin_2_id}`
  );

  if (coinsDetails?.coins[0]) {
    return `The current price of ${coin_1} is ${coinsDetails?.coins[0].price} in ${coin_2_details.coins[0].symbol}.`;
  }

  return null;
};

const AiBot = async (messageText) => {
  const client = new Wit({ accessToken: WIT_AI_ACCESS_TOKEN });
  const { intents, entities } = await client.message(messageText);

  console.log(intents);
  console.log(entities);
  // const intent = intents[0]?.name;
  const coins = entities["coin_name:coin_name"] || [];
  const exchange = entities["exchange:exchange"] || null;
  const currency = entities["currency:currency"] || null;
  const check = entities["check:check"] || null;
  exchange;

  if (check || exchange) {
    if (exchange && (coins.length > 1 || currency)) {
      const message = await getExChangeRate(coins, currency);
      return message;
    }

    if (entities["coin_name:coin_name"]) {
      const message = await getSingleCoin(coins);
      return message;
    }
  }
  return null;
};

const chatGPT = async (messageText) => {
  const messages = [{ role: "user", content: messageText }];
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: messages,
      max_tokens: 8000,
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    options
  );
  4;
  const data = await response.json();
  return data.choices[0].message.content;
};

const brian = async (messageText) => {
  const options = {
    method: "POST",
    headers: {
      "x-brian-api-key": `${BRIAN_API_KEY}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      prompt: messageText,
    }),
  };

  const response = await fetch(
    "https://api.brianknows.org/api/v0/agent/knowledge",
    options
  );
  const data = await response.json();
  return data.result;
};

const processMessage = async (messageText) => {
  try {
    let message = await AiBot(messageText);
    if (message) return { message: message, type: "AI" };

    message = await brian(messageText);
    if (message) return { ...message, message: message.text, type: "brian" };

    message = await chatGPT(messageText);
    if (message) return { message, type: "GPT" };

    return "I'm sorry, I didn't understand your query.";
  } catch (error) {
    console.error(`Error processing message: ${error.message}`);
    return "I'm sorry, there was an error processing your request.";
  }
};

app.post("/chat-bot", async (req, res) => {
  const userQuery = req.body.text;
  const response = await processMessage(userQuery);
  res.json({ response });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
