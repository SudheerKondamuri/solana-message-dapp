use anchor_lang::prelude::*;

declare_id!("6Jv2T6wLE2Hp53auaVkmDVDyzzM2yRf1ncdLt5ZgqhyA");

#[program]
pub mod solana_message_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()> {
        let account = &mut ctx.accounts.message_account;
        account.authority = ctx.accounts.authority.key();
        account.message = message;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, new_message: String) -> Result<()> {
        let account = &mut ctx.accounts.message_account;
        account.message = new_message;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 200
    )]
    pub message_account: Account<'info, MessageAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub message_account: Account<'info, MessageAccount>,

    pub authority: Signer<'info>,
}

#[account]
pub struct MessageAccount {
    pub authority: Pubkey,
    pub message: String,
}
