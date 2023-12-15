# Consumer Groups

### Consumer IDLE

* After starting one consumer, it will listen all the partitions from the topic. When another one will be connected,
consumer rebalance and start listening partitions 1.

* In case where consumers are more then partitions, some consumers will be in IDLE and wayting for his work. As soon
as partition will be free (consumer disconnects) new consumer from IDLE will listen free partition.
