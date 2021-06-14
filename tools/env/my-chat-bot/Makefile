FCLI="/Users/lauravuo-techlab/go/bin/findy-agent-cli"
USER="my-chat-bot"

export FCLI_URL=http://localhost:3000
export FCLI_TLS_PATH=$(PWD)/../config/cert
export FCLI_SERVER=localhost:50052

onboard-bot:
	$(FCLI) authn register -u $(USER)

login-bot:
	$(FCLI) authn login -u $(USER)

create-schema:
	$(FCLI) agent create-schema -a email -v 1.0 email

create-cred-def:
	$(FCLI) agent create-cred-def --id Tnruzd8jRG6uN1w4bfkiAi:2:email:1.0 --tag $(USER)

create-invitation:
	$(FCLI) agent invitation

start-bot:
	$(FCLI) bot start bot.yaml --conn-id "f38778f5-cbd4-4293-a3e8-3252088544cd"