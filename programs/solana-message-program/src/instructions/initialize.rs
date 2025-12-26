use anchor_lang::prelude::*;
use crate::MessageAccount;

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

pub fn handler(ctx: Context<Initialize>, message: String) -> Result<()> {
    let account = &mut ctx.accounts.message_account;
    account.authority = ctx.accounts.authority.key();
    account.message = message;
    msg!("Initialized with message: {}", account.message);
    Ok(())
}