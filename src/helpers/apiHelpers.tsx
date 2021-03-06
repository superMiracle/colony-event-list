import {
  ColonyClient,
  getColonyNetworkClient,
  Network,
  getLogs,
  getBlockTime,
  ColonyRole,
} from "@colony/colony-js";
import { Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";
import { utils } from "ethers";

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

export const createColonyClient = async () => {
  const provider = new InfuraProvider();

  const wallet = Wallet.createRandom();
  const connectedWallet = wallet.connect(provider);

  // Get a network client instance
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    { networkAddress: MAINNET_NETWORK_ADDRESS }
  );

  const colonyClient = await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  );
  return colonyClient;
};

export const getEventLogsColonyInitialised = async (client: ColonyClient) => {
  const eventFilter = client.filters.ColonyInitialised(null, null);
  const eventLogs = await getLogs(client, eventFilter);

  const events = eventLogs.map(async (event: any) => {
    const parsedEvent = client.interface.parseLog(event);

    const logTime = await getBlockTime(
      new InfuraProvider(),
      parsedEvent.values.blockHash
    );

    return {
      type: parsedEvent.name,
      avatar: parsedEvent.topic,
      date: new Date(logTime),
      values: [""],
    };
  });

  return Promise.all(events);
};

export const getEventLogsPayoutClaimed = async (client: ColonyClient) => {
  const eventFilter = client.filters.PayoutClaimed(null, null, null);
  const eventLogs = await getLogs(client, eventFilter);

  const events = eventLogs.map(async (event: any) => {
    const parsedEvent = client.interface.parseLog(event);

    const amount = new utils.BigNumber(parsedEvent.values.amount).toString();

    const humanReadableFundingPotId = new utils.BigNumber(
      parsedEvent.values.fundingPotId
    ).toString();

    const { associatedTypeId } = await client.getFundingPot(
      humanReadableFundingPotId
    );

    const { recipient: userAddress } = await client.getPayment(
      associatedTypeId
    );

    const logTime = await getBlockTime(
      new InfuraProvider(),
      parsedEvent.values.blockHash
    );

    return {
      type: parsedEvent.name,
      avatar: userAddress,
      date: new Date(logTime),
      values: [userAddress, amount, humanReadableFundingPotId],
    };
  });

  return Promise.all(events);
};

export const getEventLogsColonyRoleSet = async (client: ColonyClient) => {
  const eventFilter = client.filters.ColonyRoleSet(null, null, null, null);
  const eventLogs = await getLogs(client, eventFilter);

  const events = eventLogs.map(async (event: any) => {
    const parsedEvent = client.interface.parseLog(event);

    const user = parsedEvent.values.user;

    const role = Object.keys(ColonyRole).find(
      (key: any) => ColonyRole[key] === parsedEvent.values.role
    );
    const domainId = new utils.BigNumber(
      parsedEvent.values.domainId
    ).toString();

    const logTime = await getBlockTime(
      new InfuraProvider(),
      parsedEvent.values.blockHash
    );

    return {
      type: parsedEvent.name,
      avatar: user,
      date: new Date(logTime),
      values: [role, user, domainId],
    };
  });

  return Promise.all(events);
};

type IEvent = {
  type: string;
  avatar: string;
  texts: string[];
  values: string[];
  date: string;
};

export const getEventLogsDomainAdded = async (client: ColonyClient) => {
  const eventFilter = client.filters.DomainAdded(null);
  const eventLogs = await getLogs(client, eventFilter);

  const events = eventLogs.map(async (event: any) => {
    const parsedEvent = client.interface.parseLog(event);

    const humanReadableDomainId = new utils.BigNumber(
      parsedEvent.values.domainId
    ).toString();

    const logTime = await getBlockTime(
      new InfuraProvider(),
      parsedEvent.values.blockHash
    );

    return {
      type: parsedEvent.name,
      avatar: parsedEvent.topic,
      date: new Date(logTime),
      values: [humanReadableDomainId],
    };
  });

  return Promise.all(events);
};

export const getEventLogs = async (client: ColonyClient) => {
  const eventsColonyInit = await getEventLogsColonyInitialised(client);

  const eventsPayoutClaimed = await getEventLogsPayoutClaimed(client);

  const eventsRoleSet = await getEventLogsColonyRoleSet(client);

  const eventsDomainAdded = await getEventLogsDomainAdded(client);

  let events = eventsColonyInit
    .concat(eventsDomainAdded)
    .concat(eventsPayoutClaimed)
    .concat(eventsRoleSet);

  events = events.sort((a, b) =>
    a.date > b.date ? 1 : b.date > a.date ? -1 : 0
  );

  console.log(events);
  return events;
};
