import { ApiProperty } from "@nestjs/swagger";

export class AssociationsInput {
    @ApiProperty({
        description: 'The name of the association',
        example: "Domy",
        type: String,
    })
    public name: string;

    @ApiProperty({
        description: 'The list of user IDs associated with the association',
        example: [1, 2, 3],
        type: [Number],
    })
    public idUsers: number[];
}