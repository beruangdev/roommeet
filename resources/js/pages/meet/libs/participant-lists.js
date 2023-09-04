export default function participantList() {
    return {
        toggleShowParticipantList(value) {
            if (typeof value !== "boolean") value = !this.showParticipantLists;
            this.setForceHideController(value);
            this.showParticipantLists = value;
        },
        participantListInit() {},
    };
}
